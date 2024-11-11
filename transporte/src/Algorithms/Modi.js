export function Modi(costos, demanda, oferta, fase1) {
    const iteraciones = [];
    let u, v, esOptima, costosReducidos;
    const filas = costos.length;
    const columnas = demanda.length;
    const asignaciones = fase1.map(row => [...row]);
    let contador = 0;

  
    do {
       
        u = Array(filas).fill(null);
        v = Array(columnas).fill(null);
        u[0] = 0;

    
        let cambios;
        do {
            cambios = false;
            for (let i = 0; i < filas; i++) {
                for (let j = 0; j < columnas; j++) {
                    if (asignaciones[i][j] > 0 || asignaciones[i][j] > -1 ) { 
                        
                        if (u[i] !== null && v[j] === null) {
                            v[j] = costos[i][j] - u[i];
                            console.log(costos[i][j]);
                            cambios = true;
                        } else if (u[i] === null && v[j] !== null) {
                            u[i] = costos[i][j] - v[j];
                            console.log(costos[i][j]);
                            cambios = true;
                        }
                    }
                }
            }
        } while (cambios);

       
        esOptima = true;
        costosReducidos = Array.from({ length: filas }, () => Array(columnas).fill(0));
        let minReducido = Infinity;
        let minI = -1, minJ = -1;

        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (asignaciones[i][j] === 0 ) { // Solo evaluar celdas no asignadas
                    costosReducidos[i][j] = costos[i][j] - (u[i] + v[j]);
                    console.log( `costos Reducidos ${costosReducidos}` );
                    if (costosReducidos[i][j] <= 0) {
                        esOptima = false;
                        if (costosReducidos[i][j] < minReducido) {
                            minReducido = costosReducidos[i][j];
                            console.log(`min reducido ${minReducido}`);
                            minI = i;
                            minJ = j;

                            console.log(`min i = ${minI} minJ = ${minJ}`);
                        }
                    }
                }
            }
        }

        
        iteraciones.push({
            u: [...u],
            v: [...v],
            costosReducidos: costosReducidos.map(row => [...row]),
            seleccionSteppingStone: { fila: minI, columna: minJ },
            esOptima
        });

    
        if (esOptima) break;

   
        ajustarCicloCerrado(asignaciones, minI, minJ);
        contador++ ;
    } while (!esOptima && contador === 6); 

    const valorZ = calcularCostoTotal(costos, asignaciones);
   
    return { iteraciones, valorZ, asignaciones };
}


function ajustarCicloCerrado(asignaciones, i, j) {
   
    const ciclo = encontrarCiclo(asignaciones, i, j);
    console.log('Ciclo encontrado:', ciclo);


    let minValor = Infinity;
    for (let k = 1; k < ciclo.length; k += 2) {
        const [fila, col] = ciclo[k];
        minValor = Math.min(minValor, asignaciones[fila][col]);
    }
    console.log(`Valor mínimo en las posiciones impares del ciclo: ${minValor}`);

   
    for (let k = 0; k < ciclo.length; k++) {
        const [fila, col] = ciclo[k];
        console.log(`Celda actual en ciclo [${fila}, ${col}]: Valor antes del ajuste: ${asignaciones[fila][col]}`);
        
        if (k % 2 === 0) {
           
            asignaciones[fila][col] += minValor;
        } else {
           
            asignaciones[fila][col] -= minValor;
        }

        console.log(`Celda [${fila}, ${col}] después del ajuste: ${asignaciones[fila][col]}`);
    }

    console.log('Asignaciones después del ajuste del ciclo:', asignaciones);
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
