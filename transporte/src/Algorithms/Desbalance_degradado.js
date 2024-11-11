

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


export function degradacion (fase1,  ){
    const asignaciones =  contarNoCero(fase1);
    const degrada = contarFilasYColumnas(fase1);
    if (asignaciones !== degrada){

    }

}


function contarNoCero(matriz) {
    let contador = 0;
  
    for (let i = 0; i < matriz.length; i++) {
      for (let j = 0; j < matriz[i].length; j++) {
        if (matriz[i][j] !== 0) {
          contador++;
        }
      }
    }
  
    return contador;
  }
  

  function contarFilasYColumnas(matriz) {
    const filas = matriz.length;
    const columnas = matriz[0].length;
    const resultadoFilas = filas - 1;
    const resultadoColumnas = columnas - 1;
  
    return resultadoColumnas + resultadoFilas - 1 
  }

  export function verificarDegradacion(costMatrix, fase1, supply, demand) {
 
    const filas = supply.length -1;
    const columnas = demand.length;
    const requiredAsignaciones = filas + columnas - 1;

    // Contar asignaciones básicas en fase1
    let asignaciones = [];
    fase1.forEach((row, i) => {
        row.forEach((value, j) => {
            if (value > 0 || value === -1) {  // Cuenta celdas con asignación o degradación
                asignaciones.push([i, j]);
            }
        });
    });

    // Revisar si hay degradación
    if (asignaciones.length < requiredAsignaciones) {
        console.log(`Problema con degradación. Se requieren ${requiredAsignaciones} asignaciones básicas, pero solo hay ${asignaciones.length}.`);

        // Calcular cuántas asignaciones faltan
        let asignacionesRestantes = requiredAsignaciones - asignaciones.length;

        // Crear matriz auxiliar para verificar qué celdas ya están asignadas
        const asignadas = Array.from({ length: filas }, () => Array(columnas).fill(false));
        asignaciones.forEach(([i, j]) => {
            asignadas[i][j] = true;
        });

        // Generar lista de celdas no asignadas ordenadas por menor costo
        
        let celdasDisponibles = [];
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (fase1[i][j] === 0) { // Celda no asignada
                    console.log(costMatrix[i][j]);
                    celdasDisponibles.push({ fila: i, columna: j, costo: costMatrix[i][j] });
                }
            }
        }

        // Ordenar las celdas disponibles por costo ascendente
        celdasDisponibles.sort((a, b) => a.costo - b.costo);
        console.log(`celdas disponibles  `);
        console.log(celdasDisponibles);

        // Asignar -1 en las posiciones de menor costo hasta alcanzar el número de asignaciones requeridas
        for (let k = 0; k < celdasDisponibles.length && asignacionesRestantes > 0; k++) {
            const { fila, columna } = celdasDisponibles[k];
            if (fase1[fila][columna] === 0) {  // Asegura que la celda esté sin asignar
                fase1[fila][columna] = -1;  // Marcar como cero de asignación por degradación
                asignaciones.push([fila, columna]);
                asignacionesRestantes--;
            }
        }

        console.log("Asignaciones básicas ajustadas para eliminar la degradación:", asignaciones);
    } else {
        console.log("No hay degradación. Las asignaciones son suficientes.");
    }

    return fase1;
}
