type ParseInput = {
    height: number
    width: number
    grid: string[][]
    
}
// {以下のような形を受け取る
//     height: 3,
//     width: 4,
//     grid: [
//         ['#', '.', '.', '.'],
//         ['.', '.', '#', '.'],
//         ['.', '.', '.', '.'],
//     ]
// };

export function gridParseInput(inputText: string): ParseInput{

    const errorReturn = {
        height: 0,
        width: 0,
        grid: []
    }
    if (inputText.trim() === "") {
        return errorReturn
    }
    const inputLines = inputText.trim().split("\n");
    const firstLineInt = inputLines[0].split(" ").map(Number);
    const height = Number(firstLineInt[0])
    const width = Number(firstLineInt[1])

    if(Number.isNaN(height) || Number.isNaN(width)){
        return errorReturn
    }
    // console.log(height, width);
    let grid = Array.from({length: height + 2}, () => Array(width + 2).fill("#"))
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
