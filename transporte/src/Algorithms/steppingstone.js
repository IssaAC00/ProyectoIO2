export function steppingStone(costos, demanda, oferta, fase1) {
    const iteraciones = [];
    let filas = costos.length;
    let columnas = demanda.length;
    const totalOferta = oferta.reduce((sum, val) => sum + val, 0);
    const totalDemanda = demanda.reduce((sum, val) => sum + val, 0);
    const asignaciones = fase1.map(row => [...row]);

    let esDesbalanceado = false;
    if (totalOferta !== totalDemanda) {
        esDesbalanceado = true;
        if (totalOferta > totalDemanda) {
            demanda.push(totalOferta - totalDemanda); 
            for (let i = 0; i < filas; i++) {
                costos[i].push(0); 
            }
            columnas += 1;
            console.log("Se ha agregado una columna ficticia con valor 0 en todos los costos debido al desbalance de la oferta y demanda.");

        } else {
            oferta.push(totalDemanda - totalOferta);
            const nuevaFila = new Array(columnas).fill(0); 
            costos.push(nuevaFila);
            filas += 1;
            console.log("Se ha agregado una fila ficticia con valor 0 en todos los costos debido al desbalance de la oferta y demanda.");
        }
        
    }

    let esOptima;

    do {
        esOptima = true;
        let minCostoReducido = Infinity;
        let mejorCelda = null;

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

        iteraciones.push({
            asignaciones: asignaciones.map(row => [...row]),
            esOptima,
            mejorCelda,
            minCostoReducido
        });

        if (esOptima) break;

        ajustarAsignacionSteppingStone(asignaciones, mejorCelda.fila, mejorCelda.columna);
    } while (!esOptima);

    const valorZ = calcularCostoTotal(costos, asignaciones);
    const descripcionCosto = generarDescripcionCosto(costos, asignaciones); 

    return { iteraciones, valorZ, asignaciones, esDesbalanceado };
}

function generarDescripcionCosto(costos, asignaciones) {
    let descripcion = "El costo total mínimo de transporte es: ";
    let calculo = [];
    let totalCosto = 0;

    for (let i = 0; i < costos.length; i++) {
        for (let j = 0; j < costos[i].length; j++) {
            if (asignaciones[i][j] > 0) {
                const costo = costos[i][j];
                const cantidad = asignaciones[i][j];
                const multiplicacion = costo * cantidad;
                console.log(`${costo}×${cantidad} = ${multiplicacion}`);
                calculo.push(`${costo}×${cantidad}`);
                totalCosto += multiplicacion;
            } else {
                calculo.push(`0×${costos[i][j]}`);
            }
        }
    }

    descripcion += calculo.join(' + ') + ` = ${totalCosto}`;
    console.log("Resultado final:", descripcion); 
    return descripcion;
}

function calcularCostoReducido(asignaciones, costos, fila, columna) {
    const ciclo = encontrarCiclo(asignaciones, fila, columna);
    let costoReducido = 0;
    for (let k = 0; k < ciclo.length; k++) {
        const [i, j] = ciclo[k];
        costoReducido += (k % 2 === 0 ? 1 : -1) * costos[i][j];
    }
    return costoReducido;
}

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

export function visualizarMatriz(asignaciones, costos, oferta, demanda, esDesbalanceado, descripcionCosto) {
    let matrizHTML = "<table border='1'><tr><th></th>";
    
    demanda.forEach((d, idx) => matrizHTML += `<th>D${idx + 1}</th>`);
    
    if (esDesbalanceado && oferta.length > costos.length) {
        matrizHTML += `<th>Supply</th>`;
    }
    matrizHTML += "</tr>";

    for (let i = 0; i < asignaciones.length; i++) {
        matrizHTML += `<tr><td>S${i + 1}</td>`;
        for (let j = 0; j < asignaciones[i].length; j++) {
            matrizHTML += `<td>${costos[i][j]} (${asignaciones[i][j]})</td>`;
        }
        if (i < oferta.length) {
            matrizHTML += `<td>${oferta[i]}</td>`;
        }
        matrizHTML += "</tr>";
    }

    matrizHTML += "<tr><td>Demand</td>";
    demanda.forEach(d => matrizHTML += `<td>${d}</td>`);
    matrizHTML += "</tr></table>";

    matrizHTML += `<p>${descripcionCosto}</p>`;

    return matrizHTML;
}