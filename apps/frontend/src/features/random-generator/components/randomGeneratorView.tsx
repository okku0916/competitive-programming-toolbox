import { useState } from "react";
import { useRef } from "react";
import InputArea from "./input-area";
import { ParseInput } from "../utils/parse-input";
import { generate } from "../utils/random-generator.ts";

export default function RandomGeneratorView () {
  const INPUT_TEXTAREA_WIDTH = "600px";
  const INPUT_TEXTAREA_HEIGHT = "280px";
  const OUTPUT_TEXTAREA_WIDTH = "600px";
  const OUTPUT_TEXTAREA_HEIGHT = "280px";
  const ERROR_TEXTAREA_WIDTH = "1200px";
  const ERROR_TEXTAREA_HEIGHT = "200px";
  const CENTER_GAP = "20px";
  const [outputText, setOutputText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [inputText, setInputText] = useState("");

    //Clearボタン
    const clearHandle = () => {
      setOutputText("");
    };

    //生成ボタン
  const generateHandle = () => {
    let parsedNum = ParseInput(inputText);
    console.log("In RandomGeneratorView:parsed num " + parsedNum);
    let generateStr = generate(parsedNum);
    
    setOutputText(generateStr);
    setErrorText("エラーのテキストの表示");
  };
  const copyHandle = () => {
    navigator.clipboard.writeText(outputText)
  }



return (
  <div>
    <h1>ランダム入力生成</h1>
    <div style={{ display: "flex", gap: CENTER_GAP }}>
      {/* 左側 */}
      <div>
        入力エリア
        <br />
          <textarea
        //   ref={inputRef}
          style={{
            width: "600px",
            height: "280px"
          }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
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
          value={outputText}
          onChange={(e) => setOutputText(e.target.value)}//textAreaに変化があったときに呼ばれる
        />
        <br />

        <button onClick={clearHandle}>
          Clear
        </button>
        <button onClick={copyHandle}>
          Copy
        </button>
      </div>
      <div>
        Template Generator
        <button onClick={generateHandle}>
          N <br />
          Ai ... An
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
          value={errorText}

          
        />
        <br />
  </div>
  );
}