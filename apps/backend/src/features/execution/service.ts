import type { RunRequest, RunResponse } from "@cpt/shared-types"
import { executeCpp } from "./executor.js"



export async function executeCode(request: RunRequest ): Promise<RunResponse>{
  if (!request.sourceCode) {//requestにSourceCodeが存在しない場合
    throw new Error('sourceCode is required')
  }

  return executeCpp(request.sourceCode, request.input)
}