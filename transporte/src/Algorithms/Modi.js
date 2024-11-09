
export function Modi(costos, demanda, oferta, fase1) {
    const iteraciones = [];
    let u, v, esOptima, costosReducidos;
    const filas = costos.length;
    const columnas = demanda.length;
   // const costos = Array.from({ length: filas }, () => Array(columnas).fill(0));
    const asignaciones = Array.from({ length: filas }, () => Array(columnas).fill(0));


    // Calcular u y v en función de las celdas asignadas
    do {
        // Inicializar u y v para cada iteración
        u = Array(filas).fill(null);
        v = Array(columnas).fill(null);
        u[0] = 0; // Suponer u[0] = 0 para iniciar el cálculo

        // Calcular u y v en función de las celdas asignadas
        let cambios;
        do {
            cambios = false;
            for (let i = 0; i < filas; i++) {
                for (let j = 0; j < columnas; j++) {
                    if (fase1[i][j] > 0) { // Solo considerar celdas con asignaciones
                        if (u[i] !== null && v[j] === null) {
                            v[j] = costos[i][j] - u[i];
                            cambios = true;
                        } else if (u[i] === null && v[j] !== null) {
                            u[i] = costos[i][j] - v[j];
                            cambios = true;
                        }
                    }
                }
            }
        } while (cambios);

        // Calcular los costos reducidos
        esOptima = true;
        costosReducidos = Array.from({ length: filas }, () => Array(columnas).fill(0));
        let minReducido = Infinity;
        let minI = -1, minJ = -1;

        console.log(`costosReducidos antes del for: ${costosReducidos}`);
        console.log(`u: ${u}  v: ${v}`);

        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (fase1[i][j] === 0) { // Solo evaluar celdas no asignadas
                    console.log(`calculo de costo: ${ costos[i][j] -(u[i] + v[j])}`);
                    costosReducidos[i][j] = costos[i][j] - (u[i] + v[j]);
                    console.log(`costosReducidos: ${costosReducidos}`);
                    if (costosReducidos[i][j] < 0) {
                        console.log(`aqui a revisar`);
                        esOptima = false;
                        if (costosReducidos[i][j] < minReducido) {
                            console.log(`tambien entro aqui para asignar i y j `);
                            minReducido = costosReducidos[i][j];
                            minI = i;
                            minJ = j;
                        }
                    }
                }
            }
        }

        // Guardar los detalles de la iteración actual
        iteraciones.push({
            u: [...u],
            v: [...v],
            costosReducidos: costosReducidos.map(row => [...row]),
            seleccionSteppingStone: { fila: minI, columna: minJ },
            esOptima
        });

        // Si la solución es óptima, termina el ciclo
        if (esOptima) break;

        // Ajustar la matriz de asignaciones usando el ciclo cerrado de la celda seleccionada
        ajustarCicloCerrado(fase1, minI, minJ);

    } while (!esOptima); 

    const valorZ = calcularCostoTotal(costos, asignaciones);
   
    return { iteraciones, valorZ, asignaciones }

}







// Función auxiliar para ajustar la matriz de asignaciones usando un ciclo cerrado
function ajustarCicloCerrado(asignaciones, i, j) {
    // 1. Encontrar el ciclo cerrado desde la celda (i, j)
    const ciclo = encontrarCiclo(asignaciones, i, j);

    // 2. Determinar el valor mínimo en las posiciones del ciclo que restan
    let minValor = Infinity;
    for (let k = 1; k < ciclo.length; k += 2) { // Sumamos en posiciones pares, restamos en impares
        const [fila, col] = ciclo[k];
        minValor = Math.min(minValor, asignaciones[fila][col]);
    }

    // 3. Ajustar las asignaciones a lo largo del ciclo cerrado
    for (let k = 0; k < ciclo.length; k++) {
        const [fila, col] = ciclo[k];
        if (k % 2 === 0) {
            // Sumar en las posiciones pares
            asignaciones[fila][col] += minValor;
        } else {
            // Restar en las posiciones impares
            asignaciones[fila][col] -= minValor;
        }
    }
}

// Función auxiliar para encontrar el ciclo cerrado
function encontrarCiclo(asignaciones, startI, startJ) {
    const filas = asignaciones.length;
    const columnas = asignaciones[0].length;
    const ciclo = [[startI, startJ]];

    let encontrado = false;

    // Búsqueda del ciclo cerrado alternando filas y columnas
    (function buscar(fila, columna, esFila) {
        if (encontrado) return;
        
        // Búsqueda en la fila o columna, alternando
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

        // Recursivamente intentar cada posición en el ciclo
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
