// src/App.tsx
import React from 'react';

import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import RandomGeneratorPage from "./pages/RandomGeneratorPage";
import VisualizerPage from './pages/VisualizerPage';
import TestPage from './pages/TestPage';

import ArrayVisualizer from './features/visualizer/components/ArrayVisualizer';
import GraphVisualizer from './features/visualizer/components/GraphVisualizer';
import GridVisualizer from './features/visualizer/components/GridVisualizer';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* 何も改装が決まっていない時にはNavigateでrandom-generatorに遷移 */}
          <Route path="/" element={<Navigate to="/random-generator" replace />} />
          <Route path="/random-generator" element={<RandomGeneratorPage />} />
          <Route path="/visualizer" element={<VisualizerPage />} />
          <Route path="/test-page" element={<TestPage />} />

          <Route path="/visualizer" element={<VisualizerPage />}>
            {/* /visualizer にアクセスしたら VisualizerPage を表示 */}
            <Route index element={<Navigate to="1d-array" replace />} />
            <Route path="1d-array" element={<ArrayVisualizer />} />
            <Route path="graph" element={<GraphVisualizer />} />
            <Route path="grid" element={<GridVisualizer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;