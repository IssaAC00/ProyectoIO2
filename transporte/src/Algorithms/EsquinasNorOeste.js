function matrixInicio(matriz) {
    const matrix = [];
    const rows = matriz.length + 1 ;
    const colums = matriz[0].length + 1 ; 
    matrix[0] = construirArray(matriz[0].length - 1 );

    for (let i = 1; i < rows; i++) {
        matrix[i] = new Array(colums).fill(0);
        matrix[i][0]  = `F${i}`;
        if ( i === rows -1 ){
            matrix[i][0]  = `Demanda`;
        }
    }

    return matrix;
}



 function construirArray(demanda) { 
    let array = [];
    array.push("i");

    for (let i = 1; i <= demanda; i++) {
        array.push(`w${i}`);
    }
    array.push("Oferta");
    return array;
}

function llenarSistemaEnMatriz(matriz, sistema) {
    for (let i = 0; i < sistema.length; i++) {
        let ecuacion = sistema[i];
        // Llenar solo las filas de F1, F2, F3 (i+1 en matriz)
        for (let j = 1; j < matriz[i].length - 1; j++) {
            matriz[i + 1][j] = ecuacion[j - 1] || 0;
        }
        matriz[i + 1][matriz[i + 1].length - 1] = ecuacion[ecuacion.length - 1];
    }

    return matriz;
}



export function esquinaNoroeste(costo) {
    let sistema = matrixInicio(costo);
    let mat = llenarSistemaEnMatriz(sistema, costo);
    const filas = mat.length - 1; // Última fila es demanda
    const columnas = mat[0].length - 1; // Última columna es oferta

    // Copiar la matriz original para almacenar las asignaciones
    let asignaciones = Array.from({ length: filas }, () => Array(columnas).fill(0));
    let oferta = mat.map(row => row[columnas]); // Última columna
    let demanda = mat[filas]; // Última fila

  /*   let i = 0, j = 0;
    while (i < filas && j < columnas) {
        const cantidad = Math.min(oferta[i], demanda[j]);
        asignaciones[i][j] = cantidad;
        
        oferta[i] -= cantidad;
        demanda[j] -= cantidad;

        if (oferta[i] === 0) i++;
        if (demanda[j] === 0) j++;
    } */

   /*  // Construir la matriz de resultado con las asignaciones entre paréntesis
    let resultado = [];
    for (let i = 0; i < filas; i++) {
        let filaResultado = [];
        for (let j = 0; j < columnas; j++) {
            const valor = mat[i][j];
            const asignado = asignaciones[i][j];
            filaResultado.push(`${valor}(${asignado})`);
        }
        filaResultado.push(`Oferta: ${oferta[i]}`);
        resultado.push(filaResultado);
    }
    
    // Agregar la fila de demanda al resultado
    let demandaFila = demanda.slice(0, columnas).map(d => `Demanda: ${d}`);
    resultado.push(demandaFila);
 */
    return asignaciones;
}