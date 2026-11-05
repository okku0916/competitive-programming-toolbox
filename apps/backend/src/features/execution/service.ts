import type { RunRequest, RunResponse } from "@cpt/shared-types"
import { compileCpp, executeCpp, makeFileCpp, startContainer, stopContainer } from "./executor.js"
import { exitCode } from "process";



export async function executeCode(request: RunRequest ): Promise<RunResponse>{
  if (!request.sourceCode) {//requestにSourceCodeが存在しない場合
    throw new Error('sourceCode is required')
  }
  await makeFileCpp("main", request.sourceCode)
  const containerID = (await startContainer());
  
  try{
    console.log("start compile");
    const compile = await compileCpp("main", containerID);
    if(compile.exitCode != 0){ //エラーの場合
      return compile;
    }
    console.log("end compile");
    console.log("begin exe");
    const result = await executeCpp("main", request.input, containerID)
    console.log("end exe");
    console.log(result);
    // TLEの場合のexitCode
    if(result.exitCode == 137){
      result.stderr = "Time Limit Exceeded.";
    }
    return result;
  } finally{ // 最後に必ずcontainerを止める
    await stopContainer(containerID).catch((err)=>{
      console.error("containerの削除でエラー");
    });
  }
}
/*
#include <iostream>
using namespace std;
int main(){
  cout << "hello" << endl;
}

*/