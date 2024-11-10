

// Función para calcular penalización en cada fila o columna

function calcularPenalizacion(costos, indicesValidos, esColumna = false) {
    return indicesValidos.map((index) => {
        const filaOColumna = esColumna ? costos.map(row => row[index]) : costos[index];
        console.log(`Estos son los indices validos: ${indicesValidos}`);
        console.log(`Indice: ${index}`);
        console.log(`Fila o Columna: ${filaOColumna}`);
        const costosValidos = filaOColumna.filter(c => c !== Infinity);
        if (costosValidos.length < 2) return 0;
        costosValidos.sort((a, b) => a - b);
        return costosValidos[1] - costosValidos[0];
    });
}

export function metodoVogel(costos, oferta, demanda) {
    const solucion = Array.from({ length: oferta.length }, () => Array(demanda.length + 1).fill(0));
    const iteraciones = [];


    // Remover el valor extra de oferta que es la suma de los demás
    oferta.pop();
    let ofertaRestante = [...oferta];
    let demandaRestante = [...demanda];

    while (true) {
        const indicesFilas = ofertaRestante.map((o, i) => o > 0 ? i : -1).filter(i => i !== -1);
        const indicesColumnas = demandaRestante.map((d, j) => d > 0 ? j : -1).filter(j => j !== -1);

        // Chequeo adicional para evitar acceso fuera de rango
        if (indicesFilas.length === 0 || indicesColumnas.length === 0) break;

        const penalizacionFilas = calcularPenalizacion(costos, indicesFilas);
        const penalizacionColumnas = calcularPenalizacion(costos, indicesColumnas, true);

        const maxPenalizacionFila = Math.max(...penalizacionFilas);
        const maxPenalizacionColumna = Math.max(...penalizacionColumnas);

        let i, j;
        if (maxPenalizacionFila >= maxPenalizacionColumna) {
            i = indicesFilas[penalizacionFilas.indexOf(maxPenalizacionFila)];
            j = costos[i].indexOf(Math.min(...costos[i].filter(c => c !== Infinity)));
        } else {
            j = indicesColumnas[penalizacionColumnas.indexOf(maxPenalizacionColumna)];
            i = costos.map(row => row[j]).indexOf(Math.min(...costos.map(row => row[j]).filter(c => c !== Infinity)));
        }

        const asignacion = Math.min(ofertaRestante[i], demandaRestante[j]);
        solucion[i][j] = asignacion;
        iteraciones.push(`Asignar ${asignacion} unidades a la celda [${i + 1}, ${j + 1}] de costo ${costos[i][j]}
                penalizacionFilas ${penalizacionFilas} penalizacionColumnas ${penalizacionColumnas}
            `);

        ofertaRestante[i] -= asignacion;
        demandaRestante[j] -= asignacion;

        if (ofertaRestante[i] === 0) {
            for (let col = 0; col < demandaRestante.length; col++) {
                costos[i][col] = Infinity;
            }
        }
        if (demandaRestante[j] === 0) {
            for (let row = 0; row < ofertaRestante.length; row++) {
                costos[row][j] = Infinity;
            }
        }

        // Verificar si se ha cumplido toda la oferta y la demanda
        if (ofertaRestante.every(o => o === 0) && demandaRestante.every(d => d === 0)) break;
    }

    console.log("Iteraciones del método de Vogel:");
    iteraciones.forEach((iteracion, idx) => {
        console.log(`Iteración ${idx + 1}: ${iteracion}`);
    });
    console.log("Matriz de solución final:", solucion);

    return {solucion, iteraciones};
}
