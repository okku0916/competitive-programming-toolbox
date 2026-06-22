import type { RunRequest } from "@cpt/shared-types"
import { executeCpp } from "./executor.js"



export async function executeCode(request: RunRequest ) {
  if (!request.sourceCode) {//requestにSourceCodeが存在しない場合
    throw new Error('sourceCode is required')
  }

  return executeCpp(request.sourceCode)
}