export function steppingStone(costos, demanda, oferta, fase1) {
    const iteraciones = [];
    let filas = costos.length;
    let columnas = demanda.length;
    const totalOferta = oferta.reduce((sum, val) => sum + val, 0);
    const totalDemanda = demanda.reduce((sum, val) => sum + val, 0);

    // Verificar si el problema es desbalanceado
    let esDesbalanceado = false;
    if (totalOferta !== totalDemanda) {
        esDesbalanceado = true;
        if (totalOferta > totalDemanda) {
            demanda.push(totalOferta - totalDemanda); // Agregar columna ficticia
            for (let i = 0; i < filas; i++) {
                costos[i].push(0); // Agregar costo ficticio en la nueva columna
            }
            columnas += 1;
        } else {
            oferta.push(totalDemanda - totalOferta); // Agregar fila ficticia
            const nuevaFila = new Array(columnas).fill(0); // Nueva fila de costos ficticios
            costos.push(nuevaFila);
            filas += 1;
        }
        
    }

    const asignaciones = fase1.map(row => [...row]); // Copiar matriz de asignaciones inicial
    let esOptima;

    // Ciclo iterativo para encontrar la solución óptima
    do {
        esOptima = true;
        let minCostoReducido = Infinity;
        let mejorCelda = null;

        // Evaluar cada celda no asignada para determinar si reduce el costo
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (asignaciones[i][j] === 0) {
                    const costoReducido = calcularCostoReducido(asignaciones, costos, i, j);
                    if (costoReducido < 0 && costoReducido < minCostoReducido) {
                        esOptima = false;
                        minCostoReducido = costoReducido;
                        mejorCelda = { fila: i, columna: j };
                    }
                }
            }
        }

        // Guardar detalles de la iteración actual
        iteraciones.push({
            asignaciones: asignaciones.map(row => [...row]),
            esOptima,
            mejorCelda,
            minCostoReducido
        });

        // Si la solución es óptima, termina el ciclo
        if (esOptima) break;

        // Ajustar las asignaciones en función del ciclo encontrado
        ajustarAsignacionSteppingStone(asignaciones, mejorCelda.fila, mejorCelda.columna);
    } while (!esOptima);

    const valorZ = calcularCostoTotal(costos, asignaciones);

    return { iteraciones, valorZ, asignaciones, esDesbalanceado };
}

function generarDescripcionCosto(costos, asignaciones) {
    let descripcion = "The minimum total transportation cost = ";
    let calculo = [];
    let totalCosto = 0;

    // Recorrer todas las celdas para generar la descripción
    for (let i = 0; i < costos.length; i++) {
        for (let j = 0; j < costos[i].length; j++) {
            if (asignaciones[i][j] > 0) {
                const costo = costos[i][j];
                const cantidad = asignaciones[i][j];
                calculo.push(`${costo}×${cantidad}`);
                totalCosto += costo * cantidad;
            }
        }
    }

    // Unir los cálculos y agregar el total
    descripcion += calculo.join(' + ') + ` = ${totalCosto}`;
    return descripcion;
}

// Función auxiliar para calcular el costo reducido de una celda no asignada
function calcularCostoReducido(asignaciones, costos, fila, columna) {
    const ciclo = encontrarCiclo(asignaciones, fila, columna);
    let costoReducido = 0;
    for (let k = 0; k < ciclo.length; k++) {
        const [i, j] = ciclo[k];
        costoReducido += (k % 2 === 0 ? 1 : -1) * costos[i][j];
    }
    return costoReducido;
}

// Función auxiliar para ajustar la asignación de transporte basado en el ciclo de Stepping Stone
function ajustarAsignacionSteppingStone(asignaciones, i, j) {
    const ciclo = encontrarCiclo(asignaciones, i, j);
    let minValor = Infinity;
    for (let k = 1; k < ciclo.length; k += 2) {
        const [fila, col] = ciclo[k];
        minValor = Math.min(minValor, asignaciones[fila][col]);
    }
    for (let k = 0; k < ciclo.length; k++) {
        const [fila, col] = ciclo[k];
        if (k % 2 === 0) {
            asignaciones[fila][col] += minValor;
        } else {
            asignaciones[fila][col] -= minValor;
        }
    }
}

// Función auxiliar para encontrar el ciclo cerrado a partir de una celda no asignada
function encontrarCiclo(asignaciones, startI, startJ) {
    const filas = asignaciones.length;
    const columnas = asignaciones[0].length;
    const ciclo = [[startI, startJ]];

    let encontrado = false;
    (function buscar(fila, columna, esFila) {
        if (encontrado) return;
        const siguientePosiciones = [];
        if (esFila) {
            for (let col = 0; col < columnas; col++) {
                if (col !== columna && asignaciones[fila][col] > 0) {
                    siguientePosiciones.push([fila, col]);
                }
            }
        } else {
            for (let row = 0; row < filas; row++) {
                if (row !== fila && asignaciones[row][columna] > 0) {
                    siguientePosiciones.push([row, columna]);
                }
            }
        }
        for (const [nextFila, nextColumna] of siguientePosiciones) {
            if (encontrado) return;
            if (nextFila === startI && nextColumna === startJ && ciclo.length >= 4) {
                encontrado = true;
                return;
            }
            ciclo.push([nextFila, nextColumna]);
            buscar(nextFila, nextColumna, !esFila);
            if (encontrado) return;
            ciclo.pop();
        }
    })(startI, startJ, true);

    return ciclo;
}

// Función auxiliar para calcular el costo total Z
function calcularCostoTotal(costos, asignaciones) {
    let total = 0;
    for (let i = 0; i < costos.length; i++) {
        for (let j = 0; j < costos[i].length; j++) {
            if (asignaciones[i][j] > 0) {
                total += costos[i][j] * asignaciones[i][j];
            }
        }
    }
    return total;
}

// Función para visualizar la matriz incluyendo la columna o fila ficticia
export function visualizarMatriz(asignaciones, costos, oferta, demanda, esDesbalanceado, descripcionCosto) {
    let matrizHTML = "<table border='1'><tr><th></th>";
    
    // Añadir las cabeceras de demanda
    demanda.forEach((d, idx) => matrizHTML += `<th>D${idx + 1}</th>`);
    
    // Si el problema es desbalanceado y hay una fila ficticia, agregar columna ficticia (Supply)
    if (esDesbalanceado && oferta.length > costos.length) {
        matrizHTML += `<th>Supply</th>`;
    }
    matrizHTML += "</tr>";

    // Crear filas para las asignaciones
    for (let i = 0; i < asignaciones.length; i++) {
        matrizHTML += `<tr><td>S${i + 1}</td>`;
        for (let j = 0; j < asignaciones[i].length; j++) {
            matrizHTML += `<td>${costos[i][j]} (${asignaciones[i][j]})</td>`;
        }
        // Agregar la oferta a la fila
        if (i < oferta.length) {
            matrizHTML += `<td>${oferta[i]}</td>`;
        }
        matrizHTML += "</tr>";
    }

    // Mostrar la fila de demanda
    matrizHTML += "<tr><td>Demand</td>";
    demanda.forEach(d => matrizHTML += `<td>${d}</td>`);
    matrizHTML += "</tr></table>";

    // Agregar la descripción del costo total debajo de la tabla
    matrizHTML += `<p>${descripcionCosto}</p>`;

    return matrizHTML;
}