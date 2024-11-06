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

    try {
      const parsedData = JSON.parse(data.trim());

      if (!Array.isArray(parsedData) || !parsedData.every(Array.isArray)) {
        throw new Error("Los datos deben ser una lista de listas.");
      }

      const costMatrix = parsedData.slice(0, -1); 
      const supply = costMatrix.map(row => row.pop()); 
      const demand = parsedData[parsedData.length - 1]; 

      const totalSupply = supply.reduce((acc, val) => acc + val, 0);

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
    } catch (error) {
      console.error("Error al procesar los datos:", error);
      alert("Error en el formato de los datos. Asegúrate de ingresar una lista de listas válida.");
    }
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
              placeholder='[[1, 7, 3, 6], 
                            [6, 8, 3, 5], 
                            [3, 7, 2]]'
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
