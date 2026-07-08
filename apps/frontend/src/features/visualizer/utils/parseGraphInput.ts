// 型定義
export type GraphElement = {
  data: {
    id: string;
    source?: string; // 辺の始点
    target?: string; // 辺の終点
    label?: string;  // 画面に表示するテキスト
  };
};

export function parseGraphInput(inputText: string): GraphElement[] {
  if (!inputText.trim()) return [];

  const elements: GraphElement[] = []
  const inputLines = inputText.trim().split(/\r?\n/); // 改行で分ける
  const firstLineInt = inputLines[0].split(/\s+/).map(Number);
  const n = firstLineInt[0];
  const m = firstLineInt[1];
  for (let i = 1; i <= n; i++) {
    elements.push({data: { id: String(i), label: String(i) } })
  }
  for (let i = 1; i <= Math.min(m, inputLines.length-1); i++) {
    const line = inputLines[i].trim().split(/\s+/);
    if (line.length < 2) continue;
    if (!/^[0-9]+$/.test(line[0]) || !/^[0-9]+$/.test(line[1])) continue; // 数値か確認
    const u = Number(line[0]);
    const v = Number(line[1]);
    if (u < 0 || n < u || v < 0 || n < v) continue; // 範囲内チェック
    elements.push({data: { id: `e${u}-${v}`, source: '${u}', target: '${v}' }})
  }
  console.log(elements);
  return elements;
}