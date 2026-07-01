import CytoscapeComponent from 'react-cytoscapejs';
import type { GraphElement } from '../utils/parseGraphInput';

// 親から受け取る引数の型を定義
interface GraphCanvasProps {
  elements: GraphElement[];
}

export default function GraphCanvas({ elements }: GraphCanvasProps) {
  const layout = { name: 'cose' }; // グラフを自動配置する設定

  return (
    <div style={{ border: '1px solid' }}>
      <CytoscapeComponent
        elements={elements}
        layout={layout}
        style={{ width: '100%', height: '400px' }}
        // グラフの見た目を指定
        stylesheet={[
          {
            selector: 'node',
            style: {
              'background-color': '#0070f3',
              'label': 'data(id)', // ノードの中心にIDを表示
              'color': '#fff',
              'text-valign': 'center',
              'text-halign': 'center',
              'width': '30px',
              'height': '30px'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 3,
              'line-color': '#999',
            }
          }
        ]}
      />
    </div>
  );
}