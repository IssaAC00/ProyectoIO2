

export function esquinaNoroeste(oferta, demanda) {
    const solucion = Array.from({ length: oferta.length  }, () => Array(demanda.length + 1).fill(0));
    let i = 0; 
    let j = 0; 
    const iteraciones = []; 

   
    while (i < oferta.length && j < demanda.length) {
        const asignacion = Math.min(oferta[i], demanda[j]);
        solucion[i][j] = asignacion; 
        iteraciones.push(`Asignación de ${asignacion} unidades de F${i + 1} a w${j + 1}`);

        
        oferta[i] -= asignacion;
        demanda[j] -= asignacion;

        
        if (oferta[i] === 0) i++; 
        if (demanda[j] === 0) j++; 
    }

    console.log("Iteraciones necesarias para la solución factible:");
    iteraciones.forEach((iteracion, idx) => {
        console.log(`Iteración ${idx + 1}: ${iteracion}`);
    });
    console.log("Matriz de solución final:", solucion);

    return solucion;

}

export function combinarMatrices(matriz1, matriz2) {
    const resultado = [];

    for (let i = 0; i < matriz1.length; i++) {
        const filaResultado = [];
        for (let j = 0; j < matriz1[i].length; j++) {
            const valor1 = matriz1[i][j];
            const valor2 = matriz2[i][j] || 0; 

           
            if (valor2 !== 0) {
                filaResultado.push(`${valor1}(${valor2})`);
            } else {
                filaResultado.push(`${valor1}`);
            }
        }
        resultado.push(filaResultado);
    }

    return resultado;
}