//judge判定を行う

import type { CodeTestRequest, CodeTestResponse } from "@cpt/shared-types"
import { compileCpp, executeCpp, makeFileCpp, startContainer, stopContainer } from "../execution/executor.js";
import { generateInput } from "../random-generator/service.js";


export async function manegementRandomTest(req: CodeTestRequest): Promise<CodeTestResponse> {
    const sourceFile = "source";
    const answerFile = "answer";
    await makeFileCpp(sourceFile, req.sourceCode);
    await makeFileCpp(answerFile, req.answerCode);
    const containerID = await startContainer();
    // console.log("containerID = ", containerID)
    const result = await judgeCode(req, containerID);
    await stopContainer(containerID);

    return result;
}

export async function judgeCode(req: CodeTestRequest, containerID: string): Promise<CodeTestResponse>{
    const sourceCode = req.sourceCode;
    const sourceCodeLanguage = req.sourceCodeLanguage;
    const answerCode = req.answerCode;
    const answerCodeLanguage = req.answerCodeLanguage;
    const input = req.input;

    const loopLimit = 100
    const sourceFile = "source";
    const answerFile = "answer";

    
    const compileSrc = await compileCpp(sourceFile, containerID);
    const compileAns = await compileCpp(answerFile, containerID);
    if(compileSrc != undefined){
        return {
            status: "compile-error",
            target: "source",
            stdout: compileSrc.stdout,
            stderr: compileSrc.stderr,
            exitCode: compileSrc.exitCode
        };
    }
    if(compileAns != undefined){
        return {
            status: "compile-error",
            target: "answer",
            stdout: compileAns.stdout,
            stderr: compileAns.stderr,
            exitCode: compileAns.exitCode
        };
    }
    
    // 実行
    for(let i = 0; i < loopLimit; i ++){
        console.log(i);
        const randomInputs = generateInput(input);
        const srcResult = await executeCpp(sourceFile, randomInputs, containerID);
        const ansResult = await executeCpp(answerFile, randomInputs, containerID);

        if(srcResult.exitCode != 0){
            return {
                status: "runtime-error",
                target: "source",
                stdout: srcResult.stdout,
                stderr: srcResult.stderr,
                exitCode: srcResult.exitCode
            };
        }
        if(ansResult.exitCode != 0){
            return {
                status: "runtime-error",
                target: "answer",
                stdout: srcResult.stdout,
                stderr: srcResult.stderr,
                exitCode: srcResult.exitCode
            }
        }
        if(srcResult.stdout !== ansResult.stdout){
            return {
                status: "wrong-answer",
                input: randomInputs,
                expected: ansResult.stdout,
                actual: srcResult.stdout
            }
        }
    }
    return {
        status: "accepted"
    };
}