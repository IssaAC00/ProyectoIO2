import React from 'react';

function ResultDisplay({ result }) {
    return (
        <div className="result-display">
            <h2>Resultado</h2>
            <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
    );
}

export default ResultDisplay;
