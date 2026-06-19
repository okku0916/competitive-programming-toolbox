import { useState } from "react";

export default function TestPage() {
  const [result, setResult] = useState("");

  const sendCode = async () => {

  //responseは第二引数で送ったデータの返却値
  const response = await fetch('http://localhost:3000/api/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language: "c++",
      sourceCode: 'int main(){}',
      input: ""

    }),
  })

  
  

  const data = await response.json()

  console.log(data)
}

  return (
    <>
      <button onClick={sendCode}>
        実行
      </button>

      <p>{result}</p>
    </>
  );
}