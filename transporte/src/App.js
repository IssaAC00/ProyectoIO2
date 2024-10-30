// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AlgorithmSelection from './AlgorithmSelection';
import DataInput from './DataInput';
import NextScreen from './NextScreen';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AlgorithmSelection />} />
        <Route path="/input" element={<DataInput />} />
        <Route path="/next" element={<NextScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
