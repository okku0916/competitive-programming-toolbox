import { useState } from "react";
import { parseInput } from "../features/random-generator/utils/parseInput";
import { randomGenerate } from "../features/random-generator/utils/randomGenerate";
//..で1つ上の階層 VSコードでは見ている階層によって赤線が出るかもしれないが問題ない
import Header from "../components/Header";
import InputArea from "../features/random-generator/components/InputArea";
import OutputArea from "../features/random-generator/components/OutputArea";


export default function RandomGeneratorPage () {
  //ここでsetText関数とtextの関数を勝手に作ってくれている
  // setText(text1)でtextをtext1に変えてくれる
  const [outputText, setOutputText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [inputText, setInputText] = useState("");

    //Clearボタン
  const handleClear = () => {
    setOutputText("");
  };

    //生成ボタン
  const handleGenerate = () => {
    let parsedNum = parseInput(inputText);
    console.log("In RandomGeneratorView:parsed num " + parsedNum);
    let generateStr = randomGenerate(parsedNum);
    
    setOutputText(generateStr);
    setErrorText("エラーのテキストの表示");
  };

  //コピーボタン
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
  }



  return (
    <div>
      <Header />
      <h1>Random Generator</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        {/* 左側 */}
        <InputArea
          value={inputText}
          setInputText={setInputText}
          generateText={handleGenerate}
        />

        {/* 右側 */}
          <OutputArea 
            value={outputText}
            setValue={setOutputText}
            handleClear={handleClear}
            handleCopy={handleCopy}
          />
        <div>
          Template Generator
          <button onClick={handleGenerate}>
            N <br />
            Ai ... An
          </button>
        </div>
      </div>
      エラー表示
      <br />
      <textarea
            style={{
              width: "1200px",
              height: "150px",
            }}
            value={errorText}

            
          />
          <br />
    </div>
  );
}
