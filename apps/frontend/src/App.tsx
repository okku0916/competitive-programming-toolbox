// src/App.tsx
import React from 'react';

import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import RandomGenerator from "./pages/random-generator";
import Visualizer from './pages/visualizer';
import TestPage from './pages/test-page';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* 何も改装が決まっていない時にはNavigateでrandom-generatorに遷移 */}
          <Route path="/" element={<Navigate to="/random-generator" replace />} />
          <Route path="/random-generator" element={<RandomGenerator />} />
          <Route path="/visualizer" element={<Visualizer />} />
          <Route path="/test-page" element={<TestPage />} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;