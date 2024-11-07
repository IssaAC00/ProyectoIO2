
export function costoMinimo(costos, oferta, demanda) {
    const solucion = Array.from({ length: oferta.length }, () => Array(demanda.length + 1).fill(0));
    const iteraciones = [];


    let ofertaRestante = [...oferta];
    let demandaRestante = [...demanda];

    while (true) {

        let minCosto = Infinity;
        let minI = -1;
        let minJ = -1;

        if (!Array.isArray(costos) || costos.length === 0 || !Array.isArray(ofertaRestante) || ofertaRestante.length === 0) {
            console.error("Error: Dimensiones incorrectas de matrices");
            return;
        }

        for (let i = 0; i < ofertaRestante.length; i++) {
            for (let j = 0; j < demandaRestante.length; j++) {
                if (ofertaRestante[i] > 0 && demandaRestante[j] > 0 && costos[i][j] < minCosto) {
                    minCosto = costos[i][j];
                    minI = i;
                    minJ = j;
                }
            }
        }


        if (minI === -1 || minJ === -1) break;


        const asignacion = Math.min(ofertaRestante[minI], demandaRestante[minJ]);
        solucion[minI][minJ] = asignacion;
        iteraciones.push(`Asignar ${asignacion} unidades a la celda [${minI + 1}, ${minJ + 1}] de costo ${minCosto}`);


        ofertaRestante[minI] -= asignacion;
        demandaRestante[minJ] -= asignacion;


        if (ofertaRestante[minI] === 0) {
            for (let j = 0; j < demandaRestante.length; j++) {
                costos[minI][j] = Infinity;
            }
        }
        if (demandaRestante[minJ] === 0) {
            for (let i = 0; i < ofertaRestante.length; i++) {
                costos[i][minJ] = Infinity;
            }
        }
    }
    console.log("Iteraciones del método de costo mínimo:");
    iteraciones.forEach((iteracion, idx) => {
        console.log(`Iteración ${idx + 1}: ${iteracion}`);
    });
    console.log("Matriz de solución final:", solucion);

    return solucion;
}