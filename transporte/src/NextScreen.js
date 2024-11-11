import React from 'react';
import { useLocation } from 'react-router-dom';
import { esquinaNoroeste, combinarMatrices } from './Algorithms/EsquinasNorOeste.js';
import { costoMinimo } from './Algorithms/CostoMinimo.js';
import { metodoVogel } from './Algorithms/Vogel.js';
import { Modi } from './Algorithms/Modi.js';
import { verificarDegradacion } from './Algorithms/Desbalance_degradado.js';
import { steppingStone } from './Algorithms/steppingstone.js';
import './NextScreen.css';

function NextScreen() {
  const location = useLocation();
  const { supply, demand, costMatrix, algoritmo, algoritmoFase2 } = location.state || {};
  
  console.log('Datos recibidos:', { supply, demand, costMatrix });

 
  const expandedMatrix = costMatrix.map((row, index) => [...row, supply[index]]);
  expandedMatrix.push([...demand, 0]);


  const aplicarFase2 = (solucionInicial) => {
    const fase2Resultado = algoritmoFase2 === 'modi' 
      ? Modi(expandedMatrix, demand, supply, solucionInicial)
      : steppingStone(costMatrix, demand, supply, solucionInicial);
    return {
      iteraciones: fase2Resultado.iteraciones,
      asignaciones: combinarMatrices(expandedMatrix, fase2Resultado.asignaciones),
    };
  };


  let fase1 = {};
  let matrizD = [];
  let pasos = [];
  let resultadoFase2 = {};


  switch (algoritmo) {
    case 'esquinaNoroeste':
      fase1 = esquinaNoroeste(supply, demand);
      pasos = fase1.iteraciones;
      break;
    
    case 'matrizCostoMinimo':
      fase1 = costoMinimo(costMatrix, supply, demand);
      pasos = fase1.iteraciones;
      matrizD = verificarDegradacion(expandedMatrix, fase1.solucion, supply, demand);
      console.log('Matriz después de verificar degradación:', matrizD);
      break;
    
    case 'metodoVogel':
      fase1 = metodoVogel(costMatrix, supply, demand);
      pasos = fase1.iteraciones;
      break;

    default:
      console.error('Algoritmo no reconocido');
      break;
  }


  const matrizFase1 = combinarMatrices(expandedMatrix, fase1.solucion);
  resultadoFase2 = aplicarFase2(fase1.solucion);


  return (
    <div className="App">
      <h1>{algoritmo}</h1>

   
      <div>
        <h2>Iteraciones</h2>
        <ol>
          {pasos.map((iteracion, index) => (
            <li key={index}>{iteracion}</li>
          ))}
        </ol>
      </div>


      <div>
        {matrizFase1 ? (
          <TablaMatriz matriz={matrizFase1} titulo="Oferta y Demanda - Fase 1" />
        ) : (
          <p>No se ingresaron datos correctamente.</p>
        )}
      </div>

    
      <div>
        <h1>{algoritmoFase2}</h1>
        {algoritmoFase2 === 'modi' && (
          <Fase2Modi iteraciones={resultadoFase2.iteraciones} />
        )}
        
        {resultadoFase2.asignaciones ? (
          <TablaMatriz matriz={resultadoFase2.asignaciones} titulo="Resultado Fase 2" />
        ) : (
          <p>No se ingresaron datos correctamente.</p>
        )}
      </div>
    </div>
  );
}


const TablaMatriz = ({ matriz, titulo }) => {
  const numColumns = matriz[0].length;
  const numRows = matriz.length;

  return (
    <div>
      <h2>{titulo}</h2>
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
          {matriz.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? '#f8f9fa' : '#fff' }}>
              <td style={{ fontWeight: 'bold' }}>
                {rowIndex === numRows - 1 ? 'Demanda' : `F${rowIndex + 1}`}
              </td>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const Fase2Modi = ({ iteraciones }) => (
  <div>
    <h2>Iteraciones Modi</h2>
    {iteraciones.map((iteracion, index) => (
      <div key={index}>
        <h3>Iteración {index + 1}</h3>
        <h4>Costos Reducidos:</h4>
        <TablaMatriz matriz={iteracion.costosReducidos} />
        <p><strong>Es Óptima:</strong> {iteracion.esOptima.toString()}</p>
        <p><strong>Selección Stepping Stone:</strong> Columna: {iteracion.seleccionSteppingStone.columna}, Fila: {iteracion.seleccionSteppingStone.fila}</p>
        <p><strong>Valores U:</strong> {iteracion.u.join(', ')}</p>
        <p><strong>Valores V:</strong> {iteracion.v.join(', ')}</p>
      </div>
    ))}
  </div>
);

export default NextScreen;
