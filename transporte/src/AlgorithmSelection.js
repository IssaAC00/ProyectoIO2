// src/AlgorithmSelection.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AlgorithmSelection() {
  const navigate = useNavigate();
  const [algoritmo, setAlgoritmo] = useState('');
  const [degradado, setDegradado] = useState(false);
  const [desbalanceado, setDesbalanceado] = useState(false);
  const [maximizado, setMaximizado] = useState(false);
  const [rutasProhibidas, setRutasProhibidas] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedOptions = {
      algoritmo,
      degradado,
      desbalanceado,
      maximizado,
      rutasProhibidas,
    };
    navigate('/input', { state: selectedOptions });
  };

  return (
    <div className="App">
      <h1>Aplicación de Algoritmos de Transporte</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Solución Factible (Primera Fase)</h2>
          <label>
            <input 
              type="radio" 
              value="esquinaNoroeste" 
              checked={algoritmo === 'esquinaNoroeste'} 
              onChange={(e) => setAlgoritmo(e.target.value)} 
            /> Esquina Noroeste
          </label>
          <label>
            <input 
              type="radio" 
              value="matrizCostoMinimo" 
              checked={algoritmo === 'matrizCostoMinimo'} 
              onChange={(e) => setAlgoritmo(e.target.value)} 
            /> Matriz de Costo Mínimo
          </label>
          <label>
            <input 
              type="radio" 
              value="vogel" 
              checked={algoritmo === 'vogel'} 
              onChange={(e) => setAlgoritmo(e.target.value)} 
            /> Vogel
          </label>
        </div>

        <div className="form-section">
          <h2>Solución Óptima (Segunda Fase)</h2>
          <label>
            <input 
              type="radio" 
              value="steppingStone" 
              checked={algoritmo === 'steppingStone'} 
              onChange={(e) => setAlgoritmo(e.target.value)} 
            /> Stepping Stone
          </label>
          <label>
            <input 
              type="radio" 
              value="modi" 
              checked={algoritmo === 'modi'} 
              onChange={(e) => setAlgoritmo(e.target.value)} 
            /> Modi o u/v
          </label>
        </div>

        <div className="form-section">
          <h2>Opciones Adicionales</h2>
          <div className="checkbox-group">
            <label>
              <input 
                type="checkbox" 
                checked={degradado} 
                onChange={() => setDegradado(!degradado)} 
              /> Problema Degradado
            </label>
          </div>
          <div className="checkbox-group">
            <label>
              <input 
                type="checkbox" 
                checked={desbalanceado} 
                onChange={() => setDesbalanceado(!desbalanceado)} 
              /> Problema Desbalanceado
            </label>
          </div>
          <div className="checkbox-group">
            <label>
              <input 
                type="checkbox" 
                checked={rutasProhibidas} 
                onChange={() => setRutasProhibidas(!rutasProhibidas)} 
              /> Rutas Prohibidas
            </label>
          </div>
          <div className="checkbox-group">
            <label>
              <input 
                type="checkbox" 
                checked={maximizado} 
                onChange={() => setMaximizado(!maximizado)} 
              /> Problema Maximizado
            </label>
          </div>
        </div>

        <button type="submit">Siguiente</button>
      </form>
    </div>
  );
}

export default AlgorithmSelection;