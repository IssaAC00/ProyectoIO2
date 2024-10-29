// src/DataInput.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';

function DataInput() {
  const location = useLocation();
  const { algoritmo, degradado, desbalanceado, maximizado, rutasProhibidas } = location.state || {};

  const [data, setData] = useState('');

  const handleDataChange = (e) => {
    setData(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos ingresados al backend
    console.log('Datos a enviar:', {
      algoritmo,
      degradado,
      desbalanceado,
      maximizado,
      rutasProhibidas,
      data,
    });
  };

  return (
    <div className="App">
      <h1>Ingreso de Datos para {algoritmo}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label>
            Ingrese los datos requeridos:
            <textarea 
              value={data} 
              onChange={handleDataChange} 
              placeholder="Ejemplo: 10, 20, 30..."
              rows="5"
            />
          </label>
        </div>
        <button type="submit">Enviar Datos</button>
      </form>
    </div>
  );
}

export default DataInput;
