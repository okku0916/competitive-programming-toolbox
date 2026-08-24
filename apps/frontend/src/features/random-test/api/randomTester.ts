import type { Constraint } from "../../random-generator/utils/parser"

type CodeTestRequest = {
    sourceCode: string
    sourceCodeLanguage: string
    answerCode: string
    answerCodeLanguage: string
    input: Constraint[]  
}
export async function RandomTester(
    sourceCodeText: string,
    sourceCodeLanguage: string, 
    answerCodeText: string,
    answerCodeLanguage: string,
    parsedInput: Constraint[]
    ){

    const request: CodeTestRequest = {
        sourceCode: sourceCodeText,
        sourceCodeLanguage: sourceCodeLanguage,
        answerCode: answerCodeText,
        answerCodeLanguage: answerCodeLanguage,
        input: parsedInput }

    const response = await fetch('http://localhost:3000/api/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        request
    }),
    })
    return response.json()

}