//引数はstringでなくてもいいがparseInputで変換擦れたものを返すつもり
export function generate(num: number){
    //現在テキトーに書いている...ｺﾞﾒﾝ

    let n = num;
    let resultStr = "" + n + "\n";
    if(n > 0){
        for(let i = 0; i < n; i ++){
            let x = Math.floor(Math.random() * 100)
            resultStr += x + " ";
        }
        resultStr += "\n";
    }


    return resultStr;

}