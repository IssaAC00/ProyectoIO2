

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