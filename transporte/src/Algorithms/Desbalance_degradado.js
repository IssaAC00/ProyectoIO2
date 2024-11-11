

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
        return  { costMatrix,  supply, demand }; 
    }


    

}



export function desbalanceadoFila(costMatrix, supply, demand) {
    const ofertatotal = supply.reduce((total, valor) => total + valor, 0);
    const demandatotal = demand.at(-1);

    if (ofertatotal !== demandatotal) {
       
        const expandedMatrix = [...costMatrix];

    
        const emptyRow = Array(demand.length).fill(0);
        expandedMatrix.splice(expandedMatrix.length - 1, 0, emptyRow);

      
        expandedMatrix.forEach((row, index) => {
            if (index < expandedMatrix.length - 2) {
                row.push(supply[index]);
            } else if (index === expandedMatrix.length - 2) {
                row.push(0); 
            }
        });

    
        const newSupply = supply.slice();
        newSupply.push(0); 

        const demandWithoutTotal = demand.slice(0, -1);
        const newDemand = [...demandWithoutTotal, 0];

        return { expandedMatrix, newSupply, newDemand };
    } else {
        return 'No está desbalanceado';
    }
}




  export function verificarDegradacion(costMatrix, fase1, supply, demand) {
 
    const filas = supply.length -1;
    const columnas = demand.length;
    const requiredAsignaciones = filas + columnas - 1;

   
    let asignaciones = [];
    fase1.forEach((row, i) => {
        row.forEach((value, j) => {
            if (value > 0 || value === -1) {  
                asignaciones.push([i, j]);
            }
        });
    });

  
    if (asignaciones.length < requiredAsignaciones) {
      //  console.log(`Problema con degradación. Se requieren ${requiredAsignaciones} asignaciones básicas, pero solo hay ${asignaciones.length}.`);

       
        let asignacionesRestantes = requiredAsignaciones - asignaciones.length;

  
        const asignadas = Array.from({ length: filas }, () => Array(columnas).fill(false));
        asignaciones.forEach(([i, j]) => {
            asignadas[i][j] = true;
        });

     
        
        let celdasDisponibles = [];
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (fase1[i][j] === 0) {
                 //   console.log(costMatrix[i][j]);
                    celdasDisponibles.push({ fila: i, columna: j, costo: costMatrix[i][j] });
                }
            }
        }

  
        celdasDisponibles.sort((a, b) => a.costo - b.costo);
       // console.log(`celdas disponibles  `);
       // console.log(celdasDisponibles);

  
        for (let k = 0; k < celdasDisponibles.length && asignacionesRestantes > 0; k++) {
            const { fila, columna } = celdasDisponibles[k];
            if (fase1[fila][columna] === 0) {  
                fase1[fila][columna] = -1;  
                asignaciones.push([fila, columna]);
                asignacionesRestantes--;
            }
        }

       // console.log("Asignaciones básicas ajustadas para eliminar la degradación:", asignaciones);
    } else {
      //  console.log("No hay degradación. Las asignaciones son suficientes.");
    }

    return fase1;
}
