// frontend, backendで共通の型を宣言

export type RunRequest = {
    language: string,
    sourceCode: string,
    input: string
}

export type RunResponse = {
    stdout: string
    stderr: string
    exitCode: number // 0: 正常終了など
}