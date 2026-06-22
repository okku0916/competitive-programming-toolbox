import { useState } from "react";

export default function TestPage() {
  const [outPutText, setOutputText] = useState("");
  const [inputText, setInputText] = useState("")

  const sendCode = async () => {

  //responseは第二引数で送ったデータの返却値
  const response = await fetch('http://localhost:3000/api/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language: "c++",
      sourceCode: inputText,
      input: ""

    }),
  })

  
  

  const data = await response.json()

  console.log(data)
  setOutputText(data.stdout)
}

  return (

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

        
        <button onClick={sendCode}>
          実行
        </button>

      <textarea
          //   ref={inputRef}
            style={{
              width: "600px",
              height: "280px"
            }}
            value={outPutText}
            onChange={(e) => setOutputText(e.target.value)}
          />
    </div>
  );
}