import type { Constraint } from "../../random-generator/utils/parser"
import type { CodeTestRequest, CodeTestResponse } from "../../../../../../packages/shared-types/src/codeTest"
export async function RandomTester(
    sourceCodeText: string,
    sourceCodeLanguage: string, 
    answerCodeText: string,
    answerCodeLanguage: string,
    parsedInput: Constraint[]
    ): Promise<CodeTestResponse>{

    const request: CodeTestRequest = {
        sourceCode: sourceCodeText,
        sourceCodeLanguage: sourceCodeLanguage,
        answerCode: answerCodeText,
        answerCodeLanguage: answerCodeLanguage,
        input: parsedInput }

    const response = await fetch('http://localhost:3000/api/random-test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
        request
    ),
    })

    return await response.json()

}