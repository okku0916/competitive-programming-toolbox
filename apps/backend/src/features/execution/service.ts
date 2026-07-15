import type { RunRequest, RunResponse } from "@cpt/shared-types"
import { compileCpp, executeCpp } from "./executor.js"



export async function executeCode(request: RunRequest ): Promise<RunResponse>{
  if (!request.sourceCode) {//requestにSourceCodeが存在しない場合
    throw new Error('sourceCode is required')
  }

  
  const compile = await compileCpp(request.sourceCode, "main");
  if(compile == undefined){
    console.log("OK?")
  }else{
    return compile;
  }

  return executeCpp("main", request.input)
}
/*
#include <iostream>
using namespace std;
int main(){
  cout << "hello" << endl;
}

*/