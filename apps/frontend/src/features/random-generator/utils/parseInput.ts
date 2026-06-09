//この中でstringを読み取りやすい形に変換


//現在最初の文字から数字が続いている分の整数のみとってきている。num出ない場合は0を返している
export function parseInput(text: string) {
    console.log("In ParseInput(): " + text);
    let i = 0;
    let resultNum = 0;
    while('0' <= (text[i]) && text[i] <= '9'){
        console.log("in While: " + i);
        resultNum *= 10;
        resultNum += Number(text[i]);
        i++;
    }

    return resultNum;
}