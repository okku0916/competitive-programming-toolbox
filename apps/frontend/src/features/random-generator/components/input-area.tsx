//変数となるものをPropsで宣言
//変数名: 型の形
type Props = {
    //inputAreaの中のtext
    value: string;
    //setInputText
    onChange: (value: string) => void;
};

export default function InputArea({value, onChange}: Props){
    return (
        <textarea
        //   ref={inputRef}
          style={{
            width: "600px",
            height: "280px"
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
    )
}