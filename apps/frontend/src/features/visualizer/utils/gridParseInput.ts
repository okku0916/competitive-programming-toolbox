type ParseInput = {
    height: number
    width: number
    grid: string[][]
    
}

// string型のこのような形
//     //3 4
//     ###.
//     ..##
//     #..#
// から以下のような形を返す
//     height: 3,
//     width: 4,
//     grid: [
//         ['#', '.', '.', '.'],
//         ['.', '.', '#', '.'],
//         ['.', '.', '.', '.'],
//     ]
// };

export function gridParseInput(inputText: string): ParseInput{

    //height, widthが決まっていない時の戻り値
    const errorReturn = {
        height: 0,
        width: 0,
        grid: []
    }
    //何も入力がないorSPACEのみreturn
    if (inputText.trim() === "") {
        return errorReturn
    }
    const inputLines = inputText.trim().split("\n");
    //１行目を分けて数値にして返す
    const firstLineInt = inputLines[0].split(" ").map(Number);
    const height = firstLineInt[0]
    const width = firstLineInt[1]

    //数値であることを確認
    if(Number.isNaN(height) || Number.isNaN(width)){
        return errorReturn
    }
    // 返す配列を作成(初期値#で埋める)
    // ここでbfs+1indexedにするためheight + 2, width + 2の配列にしている
    let grid = Array.from({length: height + 2}, () => Array(width + 2).fill("#"))
    // inputLineから配列の中身を変更
    for(let y = 1; y <= height; y ++){
        if(inputLines[y]){
            for(let x = 0; x < width; x ++){
                // console.log(y, inputLines[y])
                if(inputLines[y][x]){
                    grid [y][x + 1] = inputLines[y][x]
                }
                
            }
        }
    }
    return{
        height,
        width,
        grid
    }
    
    
}
