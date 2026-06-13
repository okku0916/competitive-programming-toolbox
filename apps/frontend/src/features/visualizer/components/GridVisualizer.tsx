import { useState } from 'react';
import { gridParseInput } from '../utils/gridParseInput.ts';
import { gridBFS } from '../utils/gridBFS.ts';

type DisplayCell = {
    char: string
    color: string
}

export default function gridVisualizer () {
  //Reactのvalueに対してそれをsetする関数の宣言
  const [inputText, setInputText] = useState("");
  const [isShortestPath, setIsCumulativeSum] = useState(false);
  const [startXText, setStartXText] = useState("")
  const [startYText, setStartYText] = useState("")
  const [goalXText, setGoalXText] = useState("")
  const [goalYText, setGoalYText] = useState("")

  const { height, width, grid } = gridParseInput(inputText);
  // text内の最初の文字を整数に変換する
  const startX = startXText.length > 0 ? Number(startXText[0]) : -1;
  const startY = startYText.length > 0 ? Number(startYText[0]) : -1;
  const goalX = goalXText.length > 0 ? Number(goalXText[0]) : -1;
  const goalY = goalYText.length > 0 ? Number(goalYText[0]) : -1;
  const { grid: resultGrid, route, startLoc, goalLoc } 
    = gridBFS(height, width, grid, {x: startX, y: startY}, {x: goalX, y: goalY})

  // 丈夫で宣言したtype Displaycellの配列を初期化この配列の中身で色、値を管理
  const displayCells: DisplayCell[][] = Array.from(
    { length: height + 2 },
    () =>
        Array.from(
        { length: width + 2 },
        () => ({
            char: "",
            color: "#ffffff",
        })
        )
  );
  // displayCellsの中身を更新
  // color:
  // # -> black
  // othetr -> white
  // (最短経路が必要な時)
  //    route -> green

  // value
  // 最短経路がいらない時
  //    . -> ""
  //    other -> other(そのまま)
  // 最短経路が必要な時
  //   . -> distance (startからの距離, 到達不能で-1)
  //   other -> other: distance
  //   start or goal -> S: distance or G: distance

  for(let y = 1; y <= height; y++){
    for(let x = 1; x <= width; x ++){
        if(grid[y][x] == "#"){
            displayCells[y][x].color = "#000000"
        }else{
            displayCells[y][x].color = "#ffffff"
        }

        

        displayCells[y][x].char = grid[y][x] + ": "
        if(grid[y][x] == "."){
            displayCells[y][x].char = "";
        }
        if(startLoc.x == x && startLoc.y == y){
            displayCells[y][x].char = "S: "
        }
        if(goalLoc.x == x && goalLoc.y == y){
            displayCells[y][x].char = "G: "
        }
        // 最短経路を求める場合には文字列にSからの距離を追加
        if(isShortestPath){
            displayCells[y][x].char += String(resultGrid[y][x])
        }

    }
  }
  //最短経路の色変更
  if(isShortestPath){
    for(let i = 0; i < route.length; i ++){
        const x = route[i].x
        const y = route[i].y
        displayCells[y][x].color = "#00ff00"
    }
  }
  //最終的に描画するcell
  const paintCells = []
  for (let y = 1; y <= height; y++) {
    const row = [];
    for (let x = 1; x <= width; x++) {
      const color = displayCells[y][x].color
      row.push(
        <div
          key={`${y}-${x}`}
          style={{
            width: "80px",
            aspectRatio: '1 / 1', 
            fontFamily: 'monospace',
            fontSize: '32px',
            border: '1px solid #aaaaaa', /* 枠線 */
            background: color,
            alignItems: "center",
            justifyContent: "center"

          }}
        >
          {displayCells[y][x].char}
        </div>
      );
    }
    paintCells.push(
      <div key={y} style={{display: "flex"}}>
        { row }
      </div>
    );
  }
 
  
  return (
    <div>
      <div>
        <h1>
            Grid Visualizer
        </h1>
          <h3>入力エリア</h3>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}

              placeholder="例:&#13;&#10;2 8&#13;&#10;###.....#&#13;&#10;#....####"
              style={{ 
                width: '100%', 
                height: '100px', 
                padding: '12px', 
                fontFamily: 'Menlo, Monaco, Consolas, monospace, monospace',//そのままだと文字の幅が合わず追加
                fontSize: '14px'
              }}
            />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h3>ビジュアライズ結果</h3>
          <label style={{ display: 'flex', gap: '5px' }}>
            最短経路を表示
            <input 
              type="checkbox" 
              checked={isShortestPath} 
              onChange={(e) => setIsCumulativeSum(e.target.checked)}
            />
          </label>
          startX: 
            <textarea
                value={startXText}
                onChange={(e) => setStartXText(e.target.value)}

                placeholder="3"
                style={{ 
                    width: "60px",
                    height: '12px', 
                    padding: '12px', 
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    resize: "none"
                }}
            />
            startY: 
            <textarea
                value={startYText}
                onChange={(e) => setStartYText(e.target.value)}

                placeholder="1"
                style={{ 
                    width: "60px",
                    height: '12px', 
                    padding: '12px', 
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    resize: "none"
                }}
            />
            goalX: 
            <textarea
                value={goalXText}
                onChange={(e) => setGoalXText(e.target.value)}

                placeholder="1"
                style={{ 
                    width: "60px",
                    height: '12px', 
                    padding: '12px', 
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    resize: "none"
                }}
            />
            goalY: 
            <textarea
                value={goalYText}
                onChange={(e) => setGoalYText(e.target.value)}

                placeholder="3"
                style={{ 
                    width: "60px",
                    height: '12px', 
                    padding: '12px', 
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    resize: "none"
                }}
            />
        </div>
        <div>
          {paintCells}
        </div>
      </div>
    </div>
  )
}
