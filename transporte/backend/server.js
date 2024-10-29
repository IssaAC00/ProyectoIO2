const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Ruta principal para resolver problemas de transporte
app.post('/api/transport', (req, res) => {
    const { supply, demand, costMatrix, algorithm, options } = req.body;
    // Implementa aquí la lógica de cada algoritmo
    res.json({ result: "Resultado calculado (implementa lógica del algoritmo aquí)" });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
