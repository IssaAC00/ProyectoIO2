
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

        for (let i = 0; i < ofertaRestante.length-1; i++) {
            for (let j = 0; j < demandaRestante.length; j++) {
/*                 console.log(`ofertaRestante[i]: ${ofertaRestante[i]}
                     demandarestante:  ${demandaRestante[j]} 
                     cual es mi I: ${i},
                     cual es mi J ${j},
                     costo:${costos[i][j] } 
                     minimo costo ${minCosto}`
                ); */
                if (ofertaRestante[i] > 0 && demandaRestante[j] > 0 && costos[i][j] < minCosto) {
                    minCosto = costos[i][j];
                    minI = i;
                    minJ = j;
/*                     console.log(` minI ${i}
                        minJ:  ${j} 
                        minimo costo ${minCosto}`
                   ); */
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
            for (let i = 0; i < ofertaRestante.length - 1; i++) {
                costos[i][minJ] = Infinity;
            }
        }
    }
    console.log("Iteraciones del método de costo mínimo:");
    iteraciones.forEach((iteracion, idx) => {
        console.log(`Iteración ${idx + 1}: ${iteracion}`);
    });
    console.log("Matriz de solución final:", solucion);

    return {solucion, iteraciones};
}


export function combinarMatricesMinimo(matriz1, matriz2) {
    const resultado = [];

    for (let i = 0; i < matriz1.length; i++) {
        const filaResultado = [];
        for (let j = 0; j < matriz1[i].length; j++) {
            const valor1 = matriz1[i][j];
            const valor2 = matriz2[i][j] || 0; 

           
            if (valor2 !== 0) {
                filaResultado.push(`${valor1}(${valor2})`);
            } else {
                filaResultado.push(`${valor1} `);
            }
        }
        resultado.push(filaResultado);
    }

    return resultado;
}