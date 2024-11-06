

export function esquinaNoroeste(oferta, demanda) {
    const solucion = Array.from({ length: oferta.length  }, () => Array(demanda.length + 1).fill(0));
    let i = 0; // índice de la fila (fuentes)
    let j = 0; // índice de la columna (demandas)
    const iteraciones = []; // Para guardar cada iteración

    // Mientras haya oferta y demanda por asignar
    while (i < oferta.length && j < demanda.length) {
        const asignacion = Math.min(oferta[i], demanda[j]);
        solucion[i][j] = asignacion; // Asignar la cantidad mínima de oferta/demanda
        iteraciones.push(`Asignación de ${asignacion} unidades de F${i + 1} a w${j + 1}`);

        // Actualizar oferta y demanda restantes
        oferta[i] -= asignacion;
        demanda[j] -= asignacion;

        // Decidir hacia dónde moverse en la tabla (a la siguiente fila o columna)
        if (oferta[i] === 0) i++; // Si la oferta se agotó, mover a la siguiente fila
        if (demanda[j] === 0) j++; // Si la demanda se agotó, mover a la siguiente columna
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
            const valor2 = matriz2[i][j] || 0; // Si no existe el valor, asigna 0

            // Si el valor de la segunda matriz es distinto de cero, incluirlo entre paréntesis
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