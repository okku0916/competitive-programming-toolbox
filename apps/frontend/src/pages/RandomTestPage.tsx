import { useState } from "react";
import Header from "../components/Header";
import { RandomTester } from "../features/random-test/api/randomTester";
import { parseInput } from "../features/random-generator/utils/parseInput";
import type { CodeTestResponse } from "../../../../packages/shared-types/src/codeTest";

export default function RandomTestPage() {
  const [sourceCodeText, setSourceCodeText] = useState("")//ソースコード
  const [answerCodeText, setAnswerCodeText] = useState("")//解答コード
  const [inputText, setInputText] = useState("")//標準入力形式テキスト
  const [resultText, setResultText] = useState("")//結果表示

  const execute = async() => {//実行ボタンの処理
      let parsedInput = parseInput(inputText);
      console.log("In RandomGeneratorView:parsed num " + parsedInput);
      const response: CodeTestResponse = await RandomTester(sourceCodeText, "c++", answerCodeText, "c++", parsedInput);
      console.log(response)
      let result = ""
      result += response.status + "\n"
      if(response.status == "wrong-answer"){
        result += "誤った出力\n"
        result += response.actual + "\n"
        result += "正しい出力\n"
        result += response.expected + "\n"
        result += "WA標準入力: \n"
        result += response.input + "\n"
      }else if(response.status == "compile-error" || response.status == "runtime-error"){
        result += response.stderr
      }
      setResultText(result)
    };

  return (

      <div>
        <Header />
          <div style={{ display: "flex", gap: "20px" }}>
            <div>
              ソースコード入力エリア
              <br />
              <textarea
                style={{
                  width: "600px",
                  height: "280px"
                }}
                value={sourceCodeText}
                onChange={(e) => setSourceCodeText(e.target.value)}
                />
            </div>
            <div>
              解答コード入力エリア
              <br />
              <textarea
                style={{
                  width: "600px",
                  height: "280px"
                }}
                value={answerCodeText}
                onChange={(e) => setAnswerCodeText(e.target.value)}
              />
            </div>
            
            

          </div>
          
              
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          入力方式
          <br />
          <textarea
            style={{
              width: "600px",
              height: "280px"
            }}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
        <div>
          WA入力結果
          <br />
          <textarea
            style={{
              width: "600px",
              height: "280px"
            }}
            value={resultText}
            onChange={(e) => setResultText(e.target.value)}
          />
        </div>

        
      </div>
      <button onClick={ execute }
        >
        実行
      </button>
      
    </div>
  );
}