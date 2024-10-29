import React from 'react';

function Options({ setOptions }) {
    const handleOptionChange = (e) => {
        const { name, checked } = e.target;
        setOptions(prev => ({ ...prev, [name]: checked }));
    };

    return (
        <div className="form-section">
            <label>
                <input type="checkbox" name="degraded" onChange={handleOptionChange} />
                Problemas Degradados
            </label>
            <label>
                <input type="checkbox" name="unbalanced" onChange={handleOptionChange} />
                Desbalanceado
            </label>
            <label>
                <input type="checkbox" name="maximize" onChange={handleOptionChange} />
                Maximización
            </label>
        </div>
    );
}

export default Options;
