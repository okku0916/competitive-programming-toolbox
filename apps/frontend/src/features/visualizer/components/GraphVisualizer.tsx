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
      <h3>入力エリア</h3>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="例:&#13;&#10;3 3&#13;&#10;1 2 3&#13;&#10;4 5 6"
          style={{ 
            width: '100%', 
            height: '150px', 
            padding: '12px', 
            fontFamily: 'monospace',
            fontSize: '14px'
          }}
        />

      <h3>描画エリア</h3>
      <GraphCanvas elements={graphElements}/>
  </div>
  );
}