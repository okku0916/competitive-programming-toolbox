import { useState, useMemo } from 'react';
import GraphCanvas from './GraphCanvas';
import { parseGraphInput } from '../utils/parseGraphInput';

export default function GraphVisualizer () {
  const [inputText, setInputText] = useState("");
  // 入力テキストが変更された場合のみ、パースする
  const graphElements = useMemo(() => parseGraphInput(inputText), [inputText]);
return (
  <div>
    <h1>
        Graph Visualizer
    </h1>
      <div
        style={{
          width: 'fit-content',
          maxWidth: '100%',
          boxSizing: 'border-box',
          padding: '12px 16px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          backgroundColor: '#f7f7f7',
          fontSize: '14px',
          lineHeight: 1.5
        }}
      >
        <p style={{ margin: 0 }}>入力</p>
        <p style={{ margin: 0 }}>N: 頂点数、M: 辺数</p>
        <p style={{ margin: 0 }}>続くM行に辺の両端を入力</p>
      </div>
      <h3>入力エリア</h3>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="例:&#13;&#10;3 2&#13;&#10;1 2&#13;&#10;2 3&#13;&#10;"
          style={{ 
            width: '100%', 
            height: '150px', 
            padding: '12px', 
            fontFamily: 'monospace',
            fontSize: '14px'
          }}
        />

      <h3>ヴィジュアライズ結果</h3>
      <GraphCanvas elements={graphElements}/>
  </div>
  );
}
