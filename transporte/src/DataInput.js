import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css';

function DataInput() {
  const location = useLocation();
  const navigate = useNavigate();
  const { algoritmo, degradado, desbalanceado, maximizado, rutasProhibidas } = location.state || {};

  const [data, setData] = useState('');

  const handleDataChange = (e) => setData(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    const lines = data.trim().split('\n');
    // fila de demanda 
    const demand = lines.pop().split(',').map(Number);

    // oferta y matriz de costos
    const costMatrix = [];
    const supply = [];

    lines.forEach(line => {
      const values = line.split(',').map(Number);
      const offerValue = values.pop(); // La penúltima columna es la oferta
      supply.push(offerValue); 
      costMatrix.push(values);   
    });

    // Calcula el total de la oferta
    const totalSupply = supply.reduce((acc, val) => acc + val, 0);

    // Navega a la siguiente pantalla con los datos procesados, incluyendo el total de la oferta
    navigate('/next', {
      state: {
        supply: [...supply, totalSupply], 
        demand,
        costMatrix,
        algoritmo,
        degradado,
        desbalanceado,
        maximizado,
        rutasProhibidas,
      },
    });
  };

  return (
    <div className="App">
      <h1>Ingreso de Datos para {algoritmo}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label>
            Ingrese los datos (ejemplo de formato):
            <textarea
              value={data}
              onChange={handleDataChange}
              placeholder=" 1, 7, 3, 6, 3
                          6, 8, 3, 5, 4
                          3, 7, 2, 6"
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
