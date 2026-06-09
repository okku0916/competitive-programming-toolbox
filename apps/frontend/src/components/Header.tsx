//全ページで使うヘッダー
export default function Header() {
  return (
    <div style={{ borderBottom: "1px solid #ccc" }}>
        <h3>COMPETITIVE PROGRAMING TOOLBOX</h3>
      <a href="/random-generator" style={{ marginRight: "10px" }}>random-generator</a>
      <a href="/visualizer" style={{ marginRight: "10px" }}>visualizer</a>
      <a href="/test-page">test-page</a>
    </div>
  );
}