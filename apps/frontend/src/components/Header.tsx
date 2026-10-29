//全ページで使うヘッダー
export default function Header() {
  return (
    <div style={{ borderBottom: "1px solid #ccc", paddingBottom: "12px" }}>
        <h3>COMPETITIVE PROGRAMING TOOLBOX</h3>
      <a href="/random-generator" style={{ marginRight: "10px" }}>random-generator</a>
      <a href="/visualizer" style={{ marginRight: "10px" }}>visualizer</a>
      <a href="/test-page" style={{ marginRight: "10px" }}>test-page</a>
      <a href="/random-test">random-test</a>
    </div>
  );
}