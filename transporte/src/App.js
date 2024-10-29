import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AlgorithmSelection from './AlgorithmSelection';
import DataInput from './DataInput';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AlgorithmSelection />} />
        <Route path="/input" element={<DataInput />} />
      </Routes>
    </Router>
  );
}

export default App;
