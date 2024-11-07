

// Función para calcular penalización en cada fila o columna
function calcularPenalizacion(costos, indicesValidos) {
    return indicesValidos.map((index) => {
        const filaOColumna = costos[index];
        console.log(`estos son los indices validos ${indicesValidos}`);
        console.log(`fila index: ${index}`);
        console.log(`fila columna: ${filaOColumna}`)
        const costosValidos = filaOColumna.filter(c => c !== Infinity);
        if (costosValidos.length < 2) return 0;
        costosValidos.sort((a, b) => a - b);
        return costosValidos[1] - costosValidos[0];
    });
}

export function metodoVogel(costos, oferta, demanda) {
    const solucion = Array.from({ length: oferta.length }, () => Array(demanda.length + 1).fill(0));
    const iteraciones = [];


    let ofertaRestante = [...oferta];
    console.log(`oferta restante transferancia ${ofertaRestante}`);
    let demandaRestante = [...demanda];
    console.log(`oferta restante transferancia ${demandaRestante}`);

    while (true) {
        console.log(`antes de la penalizacion`);
        console.log(`esto de oferta restante: ${ofertaRestante.map((o, i) => o > 0 ? i : -1).filter(i => i !== -1)} `);
        const penalizacionFilas = calcularPenalizacion(costos, ofertaRestante.map((o, i) => o > 0 ? i : -1).filter(i => i !== -1));
        console.log(`penalizacion filas: ${penalizacionFilas}`);
        const penalizacionColumnas = calcularPenalizacion(
            costos[0].map((_, j) => costos.map(row => row[j])),
            demandaRestante.map((d, j) => d > 0 ? j : -1).filter(j => j !== -1)
        );
        console.log(`penalizacion columnas: ${penalizacionColumnas}`);

       /*  const maxPenalizacionFila = Math.max(...penalizacionFilas);
        const maxPenalizacionColumna = Math.max(...penalizacionColumnas);

        let i, j;
        if (maxPenalizacionFila >= maxPenalizacionColumna) {
            i = penalizacionFilas.indexOf(maxPenalizacionFila);
            j = costos[i].indexOf(Math.min(...costos[i].filter(c => c !== Infinity)));
        } else {
            j = penalizacionColumnas.indexOf(maxPenalizacionColumna);
            i = costos.map(row => row[j]).indexOf(Math.min(...costos.map(row => row[j]).filter(c => c !== Infinity)));
        }

        const asignacion = Math.min(ofertaRestante[i], demandaRestante[j]);
        solucion[i][j] = asignacion;
        iteraciones.push(`Asignar ${asignacion} unidades a la celda [${i + 1}, ${j + 1}] de costo ${costos[i][j]}`);


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


        if (ofertaRestante.every(o => o === 0) && demandaRestante.every(d => d === 0)) break;
    }


    console.log("Iteraciones del método de Vogel:");
    iteraciones.forEach((iteracion, idx) => {
        console.log(`Iteración ${idx + 1}: ${iteracion}`);
    });
    console.log("Matriz de solución final:", solucion); */
    }
    return solucion;
}
