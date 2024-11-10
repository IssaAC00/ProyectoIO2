import React from 'react';
import { useLocation } from 'react-router-dom';
import { esquinaNoroeste, combinarMatrices } from './Algorithms/EsquinasNorOeste.js'
import { costoMinimo } from './Algorithms/CostoMinimo.js';
import { metodoVogel } from './Algorithms/Vogel.js';
import { Modi } from './Algorithms/Modi.js'
import { desbalanceado, desbalanceadoFila } from './Algorithms/Desbalance_degradado.js';
import { steppingStone , visualizarMatriz} from './Algorithms/steppingstone.js';
import './NextScreen.css';


const Iteracion = ({ iteracion }) => (
  <div>
    <h4>Costos Reducidos:</h4>
    <table>
      <tbody> {iteracion.costosReducidos.map((fila, i) =>
        (<tr key={i}> {fila.map((valor, j) => (<td key={j}>{valor}</td>))} </tr>))}
      </tbody>
    </table>
    <p><strong>Es Óptima:</strong> {iteracion.esOptima.toString()}</p>
    <p><strong>Selección Stepping Stone:</strong>
      Columna: {iteracion.seleccionSteppingStone.columna},
      Fila: {iteracion.seleccionSteppingStone.fila}</p>
    <p><strong>Valores U:</strong> {iteracion.u.join(', ')}</p>
    <p><strong>Valores V:</strong> {iteracion.v.join(', ')}</p> </div>
);


function NextScreen() {
  const location = useLocation();
  const { supply, demand, costMatrix, algoritmo, algoritmoFase2 } = location.state || {};
  let fase1 = {};
  let matrizD = [];
  let combinar = [];
  let combinar2 = [];
  let metodoM = {};
  let pasos2 = [];
  let pasos = [];
  let stepp = {};
  console.log('Datos recibidos:', { supply, demand, costMatrix }); // Verifica los datos recibidos


  const expandedMatrix = costMatrix.map((row, index) => [...row, supply[index]]);
  expandedMatrix.push([...demand, 0]);
  console.log(expandedMatrix);


  if (algoritmo === 'esquinaNoroeste') {
    const prueba = desbalanceadoFila(costMatrix, supply, demand);
    console.log(prueba);

    fase1 = esquinaNoroeste(supply, demand);
    pasos = fase1.iteraciones;
    combinar = combinarMatrices(expandedMatrix, fase1.solucion);
    console.table(fase1.solucion);


    if (algoritmoFase2 === 'modi') {
      //aqui el modi
      metodoM = Modi(costMatrix, demand, supply, fase1.solucion);
      pasos2 = metodoM.iteraciones;
      console.log(metodoM.asignaciones);
      console.log(metodoM.iteraciones);
      combinar2 = combinarMatrices(expandedMatrix, metodoM.asignaciones);



    } else {
      stepp = steppingStone(costMatrix, demand, supply, fase1.solucion);
      pasos2 = stepp.iteraciones;
      console.log(stepp.asignaciones);
      console.log(stepp.iteraciones);
      combinar2 = combinarMatrices(expandedMatrix, stepp.asignaciones);

    }
  }
  else if (algoritmo === 'matrizCostoMinimo') {
    fase1 = costoMinimo(costMatrix, supply, demand);
    pasos = fase1.iteraciones;
    combinar = combinarMatrices(expandedMatrix, fase1.solucion);
    if (algoritmoFase2 === 'modi') {


      metodoM = Modi(costMatrix, demand, supply, fase1.solucion);
      pasos2 = metodoM.iteraciones;
      console.log(metodoM.asignaciones);
      console.log(metodoM.iteraciones);
      combinar2 = combinarMatrices(expandedMatrix, metodoM.asignaciones);


    } else {
      stepp = steppingStone(costMatrix, demand, supply, fase1.solucion);
      pasos2 = stepp.iteraciones;
      combinar2 = combinarMatrices(expandedMatrix, stepp.asignaciones);
      console.log(pasos2);
    }
  }
  else {
    fase1 = metodoVogel(costMatrix, supply, demand);
    pasos = fase1.iteraciones;
    combinar = combinarMatrices(expandedMatrix, fase1.solucion);
    console.log(fase1.solucion);
    console.log(fase1.iteraciones);
    if (algoritmoFase2 === 'modi') {
      metodoM = Modi(costMatrix, demand, supply, fase1.solucion);
      pasos2 = metodoM.iteraciones;
      console.log(metodoM.asignaciones);
      console.log(metodoM.iteraciones);
      combinar2 = combinarMatrices(expandedMatrix, metodoM.asignaciones);
    } else {
      stepp = steppingStone(costMatrix, demand, supply, fase1.solucion);
      pasos2 = stepp.iteraciones.asignaciones;
      combinar2 = combinarMatrices(expandedMatrix, stepp.asignaciones);
      console.log(stepp);
    }


  }




  console.log(combinar);

  const numColumns = combinar[0].length; // Número de columnas en la matriz
  const numRows = combinar.length;       // Número de filas en la matriz


  return (
    <div className="App">
      <h1> {algoritmo} </h1>

      <div>
        <h2>Iteraciones</h2>
        <ol>
          {pasos.map((iteracion, index) => (
            <li key={index}>{iteracion}</li>
          ))}
        </ol>
      </div>

      <div>
        {combinar ? (
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                {Array.from({ length: numColumns - 1 }, (_, index) => (
                  <th key={index} style={{ backgroundColor: '#007bff', color: '#fff' }}>
                    W{index + 1}
                  </th>
                ))}
                <th style={{ backgroundColor: '#007bff', color: '#fff' }}>Oferta</th>
              </tr>
            </thead>
            <tbody>
              {combinar.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? '#f8f9fa' : '#fff' }}>
                  {/* Etiquetas de filas: F1, F2, ..., Demanda en la última fila */}
                  <td style={{ fontWeight: 'bold' }}>
                    {rowIndex === numRows - 1 ? 'Demanda' : `F${rowIndex + 1}`}
                  </td>
                  {/* Contenido de las celdas */}
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se ingresaron datos correctamente.</p>
        )}
      </div>

      <div>
        <h1>{algoritmoFase2}</h1>

        <div>

          <h2>Resultado</h2>
          <div>

            <div>
              {algoritmoFase2 === 'modi' && (
                <div>
                  {pasos2.map((iteracion, index) => (
                    <div key={index}>
                      <h3>Iteración {index + 1}</h3>

                      <h4>Costos Reducidos:</h4>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th></th>
                            {Array.from({ length: numColumns - 1 }, (_, index) => (
                              <th key={index} style={{ backgroundColor: '#007bff', color: '#fff' }}>
                                W{index + 1}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {iteracion.costosReducidos.map((fila, rowIndex) => (
                            <tr
                              key={rowIndex}
                              style={{ backgroundColor: rowIndex % 2 === 0 ? '#f8f9fa' : '#fff' }}
                            >
                              <td style={{ fontWeight: 'bold' }}>
                                {rowIndex === iteracion.costosReducidos.length - 1
                                  ? 'Demanda'
                                  : `F${rowIndex + 1}`}
                              </td>
                              {fila.map((cell, colIndex) => (
                                <td key={colIndex}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <p><strong>Es Óptima:</strong> {iteracion.esOptima.toString()}</p>

                      <p>
                        <strong>Selección Stepping Stone:</strong> Columna: {iteracion.seleccionSteppingStone.columna}, Fila: {iteracion.seleccionSteppingStone.fila}
                      </p>

                      <p><strong>Valores U:</strong> {iteracion.u.join(', ')}</p>
                      <p><strong>Valores V:</strong> {iteracion.v.join(', ')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {combinar2 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th></th>
                    {Array.from({ length: numColumns - 1 }, (_, index) => (
                      <th key={index} style={{ backgroundColor: '#007bff', color: '#fff' }}>
                        W{index + 1}
                      </th>
                    ))}
                    <th style={{ backgroundColor: '#007bff', color: '#fff' }}>Oferta</th>
                  </tr>
                </thead>
                <tbody>
                  {combinar2.map((row, rowIndex) => (
                    <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? '#f8f9fa' : '#fff' }}>
                      {/* Etiquetas de filas: F1, F2, ..., Demanda en la última fila */}
                      <td style={{ fontWeight: 'bold' }}>
                        {rowIndex === numRows - 1 ? 'Demanda' : `F${rowIndex + 1}`}
                      </td>
                      {/* Contenido de las celdas */}
                      {row.map((cell, colIndex) => (
                        <td key={colIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No se ingresaron datos correctamente.</p>
            )}
          </div>

        </div>




      </div>
    </div>


  );

}

export default NextScreen;
