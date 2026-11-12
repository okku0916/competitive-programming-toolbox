import type { RunRequest, RunResponse } from "@cpt/shared-types"
import { compileCpp, executeCpp, makeFileCpp, removeFolder, startContainer, stopContainer } from "./executor.js"
import { endRun, startRun } from "../../lib/concurrency.js";
import { randomUUID } from "crypto";

export async function executeCode(request: RunRequest ): Promise<RunResponse>{
  if (!request.sourceCode) {//requestにSourceCodeが存在しない場合
    throw new Error('sourceCode is required')
  }
  await startRun();
  const folderName = randomUUID()
  let containerID: string | undefined;
  try{
    await makeFileCpp("main", request.sourceCode, request.language, folderName);

    containerID = (await startContainer(folderName));
    
    const compile = await compileCpp("main", containerID);
    if(compile.exitCode != 0){ //エラーの場合
      return compile;
    }

    const result = await executeCpp("main", request.input, containerID)
    // TLEの場合のexitCode
    return result;
  } finally{ // 最後に必ずcontainerを止める
    
    removeFolder(folderName);
    if(containerID){
      await stopContainer(containerID).catch((err)=>{
        console.error("containerの削除でエラー");
      });
    }

    endRun();
  }
}
/*
#include <iostream>
using namespace std;
int main(){
  cout << "hello" << endl;
}

*/