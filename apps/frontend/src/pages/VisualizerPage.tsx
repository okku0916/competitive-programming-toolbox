import { useState } from "react";
import { Link, Outlet } from 'react-router-dom';
import Header from "../components/Header";
export default function VisualizerPage () {

return (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 上部ヘッダー */}
      <Header />
      
      {/* 下部コンテンツエリア（横並びにする） */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* 左サイドバー */}
        <aside style={{ width: '120px', backgroundColor: '#f5f5f5', padding: '24px', borderRight: '1px solid #ddd' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '32px' }}>Visualizer</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <Link to="/visualizer/1d-array" style={{ textDecoration: 'none', color: '#333' }}>1次元配列</Link>
            <Link to="/visualizer/graph" style={{ textDecoration: 'none', color: '#333' }}>グラフ・木構造</Link>
          </nav>
        </aside>

        {/* 右側のメイン画面*/}
        <main style={{ padding: '24px', flex: 1, backgroundColor: '#fff' }}>
          <Outlet />
        </main>

      </div>
  </div>

  );
}