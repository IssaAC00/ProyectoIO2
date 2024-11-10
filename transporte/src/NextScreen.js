import React from 'react';
import { useLocation } from 'react-router-dom';
import { esquinaNoroeste, combinarMatrices } from './Algorithms/EsquinasNorOeste.js'
import { costoMinimo, combinarMatricesMinimo } from './Algorithms/CostoMinimo.js';
import { metodoVogel } from './Algorithms/Vogel.js';
import { metodoMODI, Modi } from './Algorithms/Modi.js'
import './NextScreen.css';

function NextScreen() {
  const location = useLocation();
  const { supply, demand, costMatrix, algoritmo } = location.state || {};

  console.log('Datos recibidos:', { supply, demand, costMatrix }); // Verifica los datos recibidos




  const expandedMatrix = costMatrix.map((row, index) => [...row, supply[index]]);
  expandedMatrix.push([...demand, 0]);
  console.log(expandedMatrix);

  const Noroestee = esquinaNoroeste(supply, demand);
  // const costoMin = costoMinimo(costMatrix, supply, demand);
  // const Vogel = metodoVogel(costMatrix, supply, demand);
  // const combinar = combinarMatrices( expandedMatrix , costoMin);
  const pasos = Noroestee.iteraciones;
  const combinar = combinarMatrices(expandedMatrix, Noroestee.solucion);
  //console.log(expandedMatrix);
  // console.table(Noroestee);
  //const combinar = combinarMatricesMinimo(expandedMatrix, Vogel);
  // const  metodoM = Modi(costMatrix, demand, supply, Noroestee);
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
    </div>
  );
}

export default NextScreen;
