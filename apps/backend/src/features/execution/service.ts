import type { RunRequest, RunResponse } from "@cpt/shared-types"
import { compileCpp, executeCpp, makeFileCpp, startContainer, stopContainer } from "./executor.js"



export async function executeCode(request: RunRequest ): Promise<RunResponse>{
  if (!request.sourceCode) {//requestにSourceCodeが存在しない場合
    throw new Error('sourceCode is required')
  }
  await makeFileCpp("main", request.sourceCode)
  const containerID = (await startContainer()).replace("\n", "");
  
  const compile = await compileCpp("main", containerID);
  if(compile == undefined){
    console.log("OK?")
  }else{
    return compile;
  }

  const result = await executeCpp("main", request.input, containerID)
  await stopContainer(containerID);
  return result;


}
/*
#include <iostream>
using namespace std;
int main(){
  cout << "hello" << endl;
}

*/