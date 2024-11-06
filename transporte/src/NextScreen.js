import React from 'react';
import { useLocation } from 'react-router-dom';
import { esquinaNoroeste, combinarMatrices } from './Algorithms/EsquinasNorOeste.js'
import './NextScreen.css';

function NextScreen() {
  const location = useLocation();
  const { supply, demand, costMatrix } = location.state || {};

  console.log('Datos recibidos:', { supply, demand, costMatrix }); // Verifica los datos recibidos



 
  const expandedMatrix = costMatrix.map((row, index) => [...row, supply[index]]);
  expandedMatrix.push([...demand, 0]);
  console.log(expandedMatrix);

  const Noroestee = esquinaNoroeste(supply, demand);
  const combinar = combinarMatrices( expandedMatrix , Noroestee);
  console.table(combinar);

  

  return (
    <div className="App">
      <h1>Datos Capturados</h1>
      
      {costMatrix && supply && demand ? (
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              {demand.map((_, index) => (
                <th key={index}>W{index + 1}</th>
              ))}
              <th>Oferta</th>
            </tr>
          </thead>
          <tbody>
            {costMatrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>F{rowIndex + 1}</td>
                {row.map((cost, colIndex) => (
                  <td key={colIndex}>{cost}</td>
                ))}
                <td>{supply[rowIndex]}</td> {/* Muestra la oferta al final de cada fila */}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Demanda</th>
              {demand.map((demandValue, index) => (
                <td key={index}>{demandValue}</td>
              ))}
              <td>Total = {supply.slice(0, -1).reduce((a, b) => a + b, 0)}</td> {/* Muestra el total de oferta sin incluir el último valor */}
            </tr>
          </tfoot>
        </table>
      ) : (
        <p>No se ingresaron datos correctamente.</p>
      )}
    </div>
  );
}

export default NextScreen;
