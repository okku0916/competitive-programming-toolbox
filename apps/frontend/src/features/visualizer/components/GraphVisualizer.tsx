import { useState } from 'react';

export default function GraphVisualizer () {
  const [inputText, setInputText] = useState("");
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
  </div>

  );
}