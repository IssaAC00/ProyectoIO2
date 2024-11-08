
export function Modi(costo, demanda, oferta, fase1) {
    const iteraciones = [];
    let u, v, esOptima, costosReducidos;
    const filas = costo.length;
    const columnas = demanda.length;
    const costos = Array.from({ length: filas }, () => Array(columnas).fill(0));
    const asignaciones = Array.from({ length: filas }, () => Array(columnas).fill(0));


    // Calcular u y v en función de las celdas asignadas
    do {
        // Inicializar u y v para cada iteración
        u = Array(filas).fill(null);
        v = Array(columnas).fill(null);
        u[0] = 0; // Suponer u[0] = 0 para iniciar el cálculo

        // Calcular u y v en función de las celdas asignadas
        let cambios;
        do {
            cambios = false;
            for (let i = 0; i < filas; i++) {
                for (let j = 0; j < columnas; j++) {
                    if (asignaciones[i][j] > 0) { // Solo considerar celdas con asignaciones
                        if (u[i] !== null && v[j] === null) {
                            v[j] = costos[i][j] - u[i];
                            cambios = true;
                        } else if (u[i] === null && v[j] !== null) {
                            u[i] = costos[i][j] - v[j];
                            cambios = true;
                        }
                    }
                }
            }
        } while (cambios);

        // Calcular los costos reducidos
        esOptima = true;
        costosReducidos = Array.from({ length: filas }, () => Array(columnas).fill(0));
        let minReducido = Infinity;
        let minI = -1, minJ = -1;

        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (asignaciones[i][j] === 0) { // Solo evaluar celdas no asignadas
                    costosReducidos[i][j] = costos[i][j] - (u[i] + v[j]);
                    if (costosReducidos[i][j] < 0) {
                        esOptima = false;
                        if (costosReducidos[i][j] < minReducido) {
                            minReducido = costosReducidos[i][j];
                            minI = i;
                            minJ = j;
                        }
                    }
                }
            }
        }

        // Guardar los detalles de la iteración actual
        iteraciones.push({
            u: [...u],
            v: [...v],
            costosReducidos: costosReducidos.map(row => [...row]),
            seleccionSteppingStone: { fila: minI, columna: minJ },
            esOptima
        });

        // Si la solución es óptima, termina el ciclo
        if (esOptima) break;

        // Ajustar la matriz de asignaciones usando el ciclo cerrado de la celda seleccionada
        ajustarCicloCerrado(asignaciones, minI, minJ);

    } while (!esOptima);



 return 0;

}






























































export function metodoMODI(matriz) {
    const filas = matriz.length;
    const columnas = matriz[0].length;

    // Inicializar matrices para costos y asignaciones separadas
    const costos = Array.from({ length: filas }, () => Array(columnas).fill(0));
    const asignaciones = Array.from({ length: filas }, () => Array(columnas).fill(0));

    // Extraer costos y asignaciones de la matriz inicial
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const cell = matriz[i][j];
            if (cell.includes('(')) {
                const [cost, asignacion] = cell.split('(');
                costos[i][j] = parseInt(cost.trim(), 10);
                asignaciones[i][j] = parseInt(asignacion.replace(')', '').trim(), 10);
            } else {
                costos[i][j] = parseInt(cell, 10);
                asignaciones[i][j] = 0;
            }
        }
    }

    // Array para almacenar todas las iteraciones
    const iteraciones = [];

    // Variables para u y v
    let u, v, esOptima, costosReducidos;

    do {
        // Inicializar u y v para cada iteración
        u = Array(filas).fill(null);
        v = Array(columnas).fill(null);
        u[0] = 0; // Suponer u[0] = 0 para iniciar el cálculo

        // Calcular u y v en función de las celdas asignadas
        let cambios;
        do {
            cambios = false;
            for (let i = 0; i < filas; i++) {
                for (let j = 0; j < columnas; j++) {
                    if (asignaciones[i][j] > 0) { // Solo considerar celdas con asignaciones
                        if (u[i] !== null && v[j] === null) {
                            v[j] = costos[i][j] - u[i];
                            cambios = true;
                        } else if (u[i] === null && v[j] !== null) {
                            u[i] = costos[i][j] - v[j];
                            cambios = true;
                        }
                    }
                }
            }
        } while (cambios);

        // Calcular los costos reducidos
        esOptima = true;
        costosReducidos = Array.from({ length: filas }, () => Array(columnas).fill(0));
        let minReducido = Infinity;
        let minI = -1, minJ = -1;

        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (asignaciones[i][j] === 0) { // Solo evaluar celdas no asignadas
                    costosReducidos[i][j] = costos[i][j] - (u[i] + v[j]);
                    if (costosReducidos[i][j] < 0) {
                        esOptima = false;
                        if (costosReducidos[i][j] < minReducido) {
                            minReducido = costosReducidos[i][j];
                            minI = i;
                            minJ = j;
                        }
                    }
                }
            }
        }

        // Guardar los detalles de la iteración actual
        iteraciones.push({
            u: [...u],
            v: [...v],
            costosReducidos: costosReducidos.map(row => [...row]),
            seleccionSteppingStone: { fila: minI, columna: minJ },
            esOptima
        });

        // Si la solución es óptima, termina el ciclo
        if (esOptima) break;

        // Ajustar la matriz de asignaciones usando el ciclo cerrado de la celda seleccionada
        ajustarCicloCerrado(asignaciones, minI, minJ);

    } while (!esOptima);

    // Calcular el valor de Z (costo total)
    const valorZ = calcularCostoTotal(costos, asignaciones);

    // Devolver todas las iteraciones y el valor final de Z
    return { iteraciones, valorZ, asignaciones };
}

// Función auxiliar para ajustar la matriz de asignaciones usando un ciclo cerrado
function ajustarCicloCerrado(asignaciones, i, j) {
    // Nota: Aquí necesitas implementar la lógica para encontrar y ajustar el ciclo cerrado
    // Es un proceso de exploración donde se alternan sumas y restas a lo largo del ciclo
    // Según el método MODI y las posiciones de asignación
    // Este paso implica encontrar el ciclo, y modificar las asignaciones en base al "stepping stone"
}

// Función auxiliar para calcular el costo total Z
function calcularCostoTotal(costos, asignaciones) {
    let total = 0;
    for (let i = 0; i < costos.length; i++) {
        for (let j = 0; j < costos[i].length; j++) {
            if (asignaciones[i][j] > 0) {
                total += costos[i][j] * asignaciones[i][j];
            }
        }
    }
    return total;
}
