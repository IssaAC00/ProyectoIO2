import React, { useState } from 'react';

function InputForm({ setSupply, setDemand, setCostMatrix }) {
    const [localSupply, setLocalSupply] = useState('');
    const [localDemand, setLocalDemand] = useState('');
    const [localCostMatrix, setLocalCostMatrix] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setSupply(localSupply.split(',').map(Number));
        setDemand(localDemand.split(',').map(Number));
        setCostMatrix(localCostMatrix.split('\n').map(row => row.split(',').map(Number)));
    };

    return (
        <form onSubmit={handleSubmit} className="form-section">
            <label>Oferta (separada por comas):</label>
            <input value={localSupply} onChange={e => setLocalSupply(e.target.value)} />

            <label>Demanda (separada por comas):</label>
            <input value={localDemand} onChange={e => setLocalDemand(e.target.value)} />

            <label>Matriz de Costos (filas separadas por líneas):</label>
            <textarea value={localCostMatrix} onChange={e => setLocalCostMatrix(e.target.value)} />

            <button type="submit">Cargar Datos</button>
        </form>
    );
}

export default InputForm;
