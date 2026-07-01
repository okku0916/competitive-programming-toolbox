import { useState } from "react";
import type { RunResponse } from "@cpt/shared-types"
import Header from "../components/Header";

export default function TestPage() {
  const [outPutText, setOutputText] = useState("");
  const [codeText, setCodeText] = useState("")
  const [inputText, setInputText] = useState("")
  const [errorText, setErrorText] = useState("")

  const sendCode = async () => {
  setOutputText("");

  //responseは第二引数で送ったデータの返却値
  const response = await fetch('http://localhost:3000/api/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language: "c++",
      sourceCode: codeText,
      input: inputText

    }),
  })
  const data: RunResponse = await response.json()

  console.log(data)
  if(data.exitCode == 0){
    setOutputText(data.stdout)
  }else{
    setOutputText(data.stderr)
  }
  
  // setErrorText(data.stderr)
}

  return (

      <div>
        <Header />
          <div style={{ display: "flex", gap: "20px" }}>
            <div>
              コード入力エリア
              <br />
              <textarea
                style={{
                  width: "600px",
                  height: "280px"
                }}
                value={codeText}
                onChange={(e) => setCodeText(e.target.value)}
                />
            </div>
            <div>
              標準入力
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
            
            

          </div>
          
              


        
        <button onClick={sendCode}>
          実行
        </button>
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          標準出力
          <br />
          <textarea
            style={{
              width: "600px",
              height: "280px"
            }}
            value={outPutText}
            onChange={(e) => setOutputText(e.target.value)}
          />
        </div>
        <div>
          標準エラー
          <br />
          <textarea
            style={{
              width: "600px",
              height: "280px"
            }}
            value={errorText}
            onChange={(e) => setErrorText(e.target.value)}
          />
        </div>
        
      </div>
      
    </div>
  );
}