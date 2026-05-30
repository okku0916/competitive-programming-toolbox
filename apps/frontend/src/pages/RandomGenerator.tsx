import { useState } from "react";
import { useRef } from "react";

export default function HomePage() {
  const INPUT_TEXTAREA_WIDTH = "600px";
  const INPUT_TEXTAREA_HEIGHT = "280px";
  const OUTPUT_TEXTAREA_WIDTH = "600px";
  const OUTPUT_TEXTAREA_HEIGHT = "280px";
  const ERROR_TEXTAREA_WIDTH = "1200px";
  const ERROR_TEXTAREA_HEIGHT = "200px";
  const [OutputText, setOutputText] = useState("");
  const [ErrorText, setErrorText] = useState("");
  const inputRef = useRef(null);

    //Clearボタン
    const clearHandle = () => {
      setOutputText("");
    };

    //生成ボタン
  const generateHandle = () => {
    console.log(inputRef.current.value)
    let number = 10;
    let str = "" + number + "\n";
    for(let i = 0; i < number; i ++){
        str += i + " ";
    setOutputText(`${(str)}\n`);
    }
    setErrorText("エラーのテキストの表示");
  };



return (
  <div>
    <h1>ランダム入力生成</h1>
    <div style={{ display: "flex", gap: "20px" }}>
      {/* 左側 */}
      <div>
        入力エリア
        <br />
        <textarea
          ref={inputRef}
          style={{
            width: INPUT_TEXTAREA_WIDTH,
            height: INPUT_TEXTAREA_HEIGHT,
          }}
          // value={inputTextArea}
          // onChange={}
        />
        <br />

        <button onClick={generateHandle}>
          Generate
        </button>
      </div>

      {/* 右側 */}
      <div>
        生成エリア
        <br />

        <textarea
          style={{
            width: OUTPUT_TEXTAREA_WIDTH,
            height: OUTPUT_TEXTAREA_HEIGHT,
          }}
          value={OutputText}
          onChange={(e) => setOutputText(e.target.value)}//textAreaに変化があったときに呼ばれる
        />
        <br />

        <button onClick={clearHandle}>
          Clear
        </button>
      </div>
    </div>
    エラー表示
    <br />
    <textarea
          style={{
            width: ERROR_TEXTAREA_WIDTH,
            height: ERROR_TEXTAREA_HEIGHT,
          }}
          value={ErrorText}

          
        />
        <br />
  </div>
  );
}