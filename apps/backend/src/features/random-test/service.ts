//judge判定を行う

import type { CodeTestRequest, CodeTestResponse } from "@cpt/shared-types"
import { compileCpp, executeCpp, makeFileCpp, startContainer, stopContainer } from "../execution/executor.js";
import { generateInput } from "../random-generator/service.js";


export async function manegementRandomTest(req: CodeTestRequest): Promise<CodeTestResponse> {

    console.log(req);
    const sourceFile = "source";
    const answerFile = "answer";
    await makeFileCpp(sourceFile, req.sourceCode);// storage/tmpにsourceFile.cppを作成
    await makeFileCpp(answerFile, req.answerCode);// storage/tmpにanswerFile.cppを作成
    const containerID = await startContainer();// gcc14Containerを起動
    // console.log("containerID = ", containerID)
    const result = await judgeCode(req, containerID);// WAをrandomcaseで探索
    await stopContainer(containerID);// 起動したContainerを削除
    console.log("result = ")
    console.log(result)

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
        console.log(randomInputs);
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
        srcResult.stdout = srcResult.stdout.replaceAll(/\s+\n/g, "\n");
        ansResult.stdout = ansResult.stdout.replaceAll(/\s+\n/g, "\n");
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