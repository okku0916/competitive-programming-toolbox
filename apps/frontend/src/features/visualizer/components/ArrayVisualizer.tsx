import { useState } from 'react';

export default function ArrayVisualizer () {
  const [inputText, setInputText] = useState("");
  const [isCumulativeSum, setIsCumulativeSum] = useState(false);

  const lines = inputText.split('\n').map(line => line.trim()).filter(line => line !== ''); // 行ごとに分割
  const size = lines[0] ? parseInt(lines[0], 10) : 0; // 入力されたサイズ
  const inputArray = lines[1] ? lines[1].split(' ') : []; // 入力された配列の要素
  const elements = Array.from({ length: size }, (_, i) => inputArray[i] ?? "");
  const cumulativeSums = elements.reduce((acc, element) => {
    const num = parseInt(element, 10) || 0;
    acc.push(acc[acc.length - 1] + num);
    return acc;
  }, [0]);

return (
  <div>
    <div>
      <h1>
          1D Array Visualizer
      </h1>
        <h3>入力エリア</h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="例:&#13;&#10;9&#13;&#10;3 1 4 1 5 9 2 6 5"
            style={{ 
              width: '100%', 
              height: '100px', 
              padding: '12px', 
              fontFamily: 'monospace',
              fontSize: '14px'
            }}
          />
    </div>

    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <h3>ビジュアライズ結果</h3>
        <label style={{ display: 'flex', gap: '5px' }}>
          累積和を表示
          <input 
            type="checkbox" 
            checked={isCumulativeSum} 
            onChange={(e) => setIsCumulativeSum(e.target.checked)}
          />
        </label>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '12px'}}>
        {elements.map((element, index) => (
          <div
            key={index}
            style={{
              width: '80px',           /* ボックスの幅*/
              aspectRatio: '1 / 1',   /* 幅と高さを1:1にする */
              fontFamily: 'monospace',
              fontSize: '32px',
              wordBreak: 'break-all', /* はみ出さないように折り返す */
              border: '1px solid #aaaaaa', /* 枠線 */
              background: '#ffffff',
              
              /* 文字を中央に配置する設定 */
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              boxSizing: 'border-box'
            }}>
            {element}
          </div>
        ))}
      </div>

      {isCumulativeSum && (<div style={{ display: 'flex', flexWrap: 'wrap'}}>
        {cumulativeSums.map((element, index) => (
          <div
            key={index}
            style={{
              width: '80px',           /* ボックスの幅*/
              aspectRatio: '1 / 1',   /* 幅と高さを1:1にする */
              fontFamily: 'monospace',
              fontSize: '32px',
              wordBreak: 'break-all', /* はみ出さないように折り返す */
              border: '1px solid #aaaaaa', /* 枠線 */
              backgroundColor: '#ffffff',
              
              /* 文字を中央に配置する設定 */
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              boxSizing: 'border-box'
            }}>
            {element}
          </div>
        ))} 
      </div>)}
    </div>
  </div>
  );
}