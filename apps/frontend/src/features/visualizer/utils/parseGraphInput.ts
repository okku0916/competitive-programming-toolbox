// 型定義
export type GraphElement = {
  data: {
    id?: string;
    source?: string; // 辺の始点
    target?: string; // 辺の終点
    label?: string;  // 画面に表示するテキスト
  };
};

export function parseGraphInput(inputText: string): GraphElement[] {
    // 現在はパースせず、モックを返す
    const mockElements: GraphElement[] = [
        // 頂点（Nodes）
        { data: { id: '1', label: 'Node 1' } },
        { data: { id: '2', label: 'Node 2' } },
        { data: { id: '3', label: 'Node 3' } },
        // 辺（Edges）
        { data: { source: '1', target: '2', label: 'Edge 1-2' } },
        { data: { source: '2', target: '3', label: 'Edge 2-3' } }
    ];
  return mockElements;
}