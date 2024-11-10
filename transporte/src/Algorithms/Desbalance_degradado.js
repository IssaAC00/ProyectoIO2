

export function desbalanceado(costMatrix, supply, demand) {
    const ofertatotal = supply.at(-1);
    const demandatotal = demand.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
    if (ofertatotal !== demandatotal) {
        const expandedMatrix = costMatrix.map((row, index) => [...row, supply[index]]);
        expandedMatrix.push([...demand, 0]);
        const nuevaPosicion = expandedMatrix[0].length - 1;
        expandedMatrix.forEach(fila => { fila.splice(nuevaPosicion, 0, 0); });


        const nuevaDemanda = expandedMatrix.pop();
        const nuevaSupply = expandedMatrix.map(row => row.pop());
        let deman = nuevaDemanda.slice(0, -1) ;
        return { expandedMatrix,  nuevaSupply, deman };
    } else {
        return 'No esta desbalanceado';
    }


    

}



export function desbalanceadoFila(costMatrix, supply, demand) {
    const ofertatotal = supply.reduce((total, valor) => total + valor, 0);
    const demandatotal = demand.at(-1);

    if (ofertatotal !== demandatotal) {
        // Crear una nueva matriz con la fila extra
        const expandedMatrix = [...costMatrix];

        // Insertar una fila vacía entre la penúltima y última fila
        const emptyRow = Array(demand.length).fill(0);
        expandedMatrix.splice(expandedMatrix.length - 1, 0, emptyRow);

        // Extender las filas existentes con un valor adicional de 0
        expandedMatrix.forEach((row, index) => {
            if (index < expandedMatrix.length - 2) {
                row.push(supply[index]);
            } else if (index === expandedMatrix.length - 2) {
                row.push(0); // La nueva fila vacía
            }
        });

        // Agregar la columna de demandas
        const newSupply = supply.slice();
        newSupply.push(0); // Añadir un valor de 0 al final de supply

        const demandWithoutTotal = demand.slice(0, -1);
        const newDemand = [...demandWithoutTotal, 0];

        return { expandedMatrix, newSupply, newDemand };
    } else {
        return 'No está desbalanceado';
    }
}
