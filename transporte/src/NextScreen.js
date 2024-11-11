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

  // Expande la matriz inicial con demanda y oferta
  const expandedMatrix = costMatrix.map((row, index) => [...row, supply[index]]);
  expandedMatrix.push([...demand, 0]);

  // Función auxiliar para ejecutar la Fase 2
  const aplicarFase2 = (solucionInicial) => {
    const fase2Resultado = algoritmoFase2 === 'modi' 
      ? Modi(costMatrix, demand, supply, solucionInicial)
      : steppingStone(costMatrix, demand, supply, solucionInicial);
    return {
      iteraciones: fase2Resultado.iteraciones,
      asignaciones: combinarMatrices(expandedMatrix, fase2Resultado.asignaciones),
    };
  };

  // Variables de salida
  let fase1 = {};
  let matrizD = [];
  let pasos = [];
  let resultadoFase2 = {};

  // Ejecución de Fase 1
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

  // Ejecuta Fase 2 si hay una solución inicial de Fase 1
  const matrizFase1 = combinarMatrices(expandedMatrix, fase1.solucion);
  resultadoFase2 = aplicarFase2(fase1.solucion);

  // Renderizado final
  return (
    <div className="App">
      <h1>{algoritmo}</h1>

      {/* Iteraciones de Fase 1 */}
      <div>
        <h2>Iteraciones</h2>
        <ol>
          {pasos.map((iteracion, index) => (
            <li key={index}>{iteracion}</li>
          ))}
        </ol>
      </div>

      {/* Matriz combinada de Fase 1 */}
      <div>
        {matrizFase1 ? (
          <TablaMatriz matriz={matrizFase1} titulo="Oferta y Demanda - Fase 1" />
        ) : (
          <p>No se ingresaron datos correctamente.</p>
        )}
      </div>

      {/* Iteraciones y resultado de Fase 2 */}
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

// Componente para mostrar tablas de matrices
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

// Componente específico para mostrar iteraciones del algoritmo Modi
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
