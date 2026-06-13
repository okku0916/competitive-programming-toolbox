
type Locate = {
    x: number
    y: number
   
}
type CellState = {
    pos: Locate
    distance: number
}
function isFind(locate: Locate, height: number, width: number): boolean {
    if(0 < locate.x && locate.x <= width && 0 < locate.y && locate.y <= height){
        return true
    }
    return false
}
type Result = {
    grid: number[][]
    route: Locate[]
    startLoc: Locate
    goalLoc: Locate

}

export function gridBFS(height: number, width: number, grid: string[][],
                        startLocate: Locate = {x: -1, y: -1}, goalLocate: Locate = {x: -1, y: -1}): Result{
    
    const directionX = [1, 0, -1, 0]
    const directionY = [0, 1, 0, -1]
    if(!isFind(startLocate, height, width) || !isFind(goalLocate, height, width)){//start, goalが与えられていない時gridからS, Gを探す
        // console.log("notFind")
        for(let y = 1; y <= height; y ++){
            for(let x = 1; x <= width; x ++){
                // console.log(y, x, grid[y][x])
                if(grid[y][x] == 'S'){
                    // console.log("Find S")
                    startLocate = {x: x, y: y} 
                }
                if(grid[y][x] == 'G'){
                    // console.log("Find G")
                    goalLocate = {x: x, y: y}
                }
            }
        }
    }
    let resultGrid = Array.from({length: height + 2}, () => Array(width + 2).fill(-1))
    let route: Locate[] = []
    if(!isFind(startLocate, height, width)){//Sが定義されていないとき
        // console.log("not Find")
        return {grid:resultGrid, route: route, startLoc: startLocate, goalLoc: goalLocate}

    }
    
    const queue: CellState[] = [];
    queue.push({pos:startLocate, distance: 0});
    const prev = Array.from(
    { length: height + 2 },
    () => Array<Locate | null>(width + 2).fill(null)
    );

    while(queue.length > 0){
        const cell = queue.shift();
        if(!cell){//実際にはおこらないがundefinedエラーが出ないように明示
            continue
        }
        const nowX = cell.pos.x, nowY = cell.pos.y, nowDistance = cell.distance
        resultGrid[nowY][nowX] = nowDistance
        
        for(let i = 0; i < 4; i ++){
            let nextX = nowX + directionX[i];
            let nextY = nowY + directionY[i];
            if(grid[nextY][nextX] != '#' && resultGrid[nextY][nextX] < 0){
                queue.push({pos :{x: nextX, y: nextY}, distance: nowDistance + 1})
                prev[nextY][nextX] = {x: nowX, y: nowY}
            }
            
        }

    }
    //goalがある場合には経路復元
    if(isFind(goalLocate, height, width)){
        let loc = goalLocate
        while(1){
            const p = prev[loc.y][loc.x]
            if(p == null){
                break;
            }
            route.push(loc)

            loc = p

            if(loc.x == startLocate.x && loc.y == startLocate.y){
                route.push(loc)
                break;
            }
            
        }

    }
    


    return {grid: resultGrid, route: route, startLoc: startLocate, goalLoc: goalLocate}


}