export function steppingStone(costos, demanda, oferta, fase1) {
    const iteraciones = [];
    const filas = costos.length;
    const columnas = demanda.length;
    const asignaciones = fase1.map(row => [...row]); // Copiar matriz de asignaciones inicial

    let esOptima;

    // Ciclo iterativo para encontrar la solución óptima
    do {
        // Inicializar variables
        esOptima = true;
        let minCostoReducido = Infinity;
        let mejorCelda = null;

        // Evaluar cada celda no asignada para determinar si reduce el costo
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (asignaciones[i][j] === 0) { // Solo considerar celdas no asignadas
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

    return { iteraciones, valorZ, asignaciones };
}

// Función auxiliar para calcular el costo reducido de una celda no asignada
function calcularCostoReducido(asignaciones, costos, fila, columna) {
    // Encontrar el ciclo para la celda no asignada
    const ciclo = encontrarCiclo(asignaciones, fila, columna);
    
    // Calcular el costo reducido sumando y restando alternadamente
    let costoReducido = 0;
    for (let k = 0; k < ciclo.length; k++) {
        const [i, j] = ciclo[k];
        costoReducido += (k % 2 === 0 ? 1 : -1) * costos[i][j];
    }

    return costoReducido;
}

// Función auxiliar para ajustar la asignación de transporte basado en el ciclo de Stepping Stone
function ajustarAsignacionSteppingStone(asignaciones, i, j) {
    // Encontrar el ciclo cerrado desde la celda (i, j)
    const ciclo = encontrarCiclo(asignaciones, i, j);

    // Determinar el valor mínimo en las posiciones del ciclo que restan
    let minValor = Infinity;
    for (let k = 1; k < ciclo.length; k += 2) {
        const [fila, col] = ciclo[k];
        minValor = Math.min(minValor, asignaciones[fila][col]);
    }

    // Ajustar las asignaciones a lo largo del ciclo
    for (let k = 0; k < ciclo.length; k++) {
        const [fila, col] = ciclo[k];
        if (k % 2 === 0) {
            asignaciones[fila][col] += minValor; // Sumar en posiciones pares
        } else {
            asignaciones[fila][col] -= minValor; // Restar en posiciones impares
        }
    }
}

// Función auxiliar para encontrar el ciclo cerrado a partir de una celda no asignada
function encontrarCiclo(asignaciones, startI, startJ) {
    const filas = asignaciones.length;
    const columnas = asignaciones[0].length;
    const ciclo = [[startI, startJ]];

    let encontrado = false;

    // Búsqueda del ciclo cerrado alternando filas y columnas
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
