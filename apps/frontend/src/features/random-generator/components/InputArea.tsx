//変数となるものをPropsで宣言
//変数名: 型の形
type Props = {
    //inputAreaの中のtext
    value: string;
    //setInputText
    setInputText: (value: string) => void;
    generateText: () => void;

};

export default function InputArea({value, setInputText, generateText}: Props){
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
            value={value}
            onChange={(e) => setInputText(e.target.value)}
          />
          <br />

          <button onClick={generateText}>
            Generate
          </button>
        </div>
    )
}