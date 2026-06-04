//変数となるものをPropsで宣言
//変数名: 型の形
type Props = {
    //inputAreaの中のtext
    value: string;
    //setInputText
    setValue: (value: string) => void;
    handleClear: () => void;
    handleCopy: () => void;
};

export default function OutputArea({value, setValue, handleClear, handleCopy}: Props){
    return (
        <div>
          生成エリア
          <br />

          <textarea
            style={{
              width: "600px",
              height: "280px",
            }}
            value={value}
            onChange={(e) => setValue(e.target.value)}//textAreaに変化があったときに呼ばれる
          />
          <br />

          <button onClick={handleClear}>
            Clear
          </button>
          <button onClick={handleCopy}>
            Copy
          </button>
        </div>
    )
}