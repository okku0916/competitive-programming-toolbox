// このファイルでファイルに保存, コンパイル, 実行を行う

import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import { writeFile } from 'node:fs/promises'

// 標準出力の方のようなもの
// Exec Asynchronous 非同期にするためのものそのままではawaitを使えない
const execAsync = promisify(exec)

export async function executeCpp(sourceCode: string) {

//   sourceCodeをtmpの中にかく
  await writeFile('./storage/tmp/main.cpp', sourceCode)
//   console.log("save")

//   docker内で/Storage/tmpのフォルダを参照できるように定義
// process.cwdで現在の階層の位置を返す
  const workspace = `${process.cwd()}/storage/tmp`

  // コンパイル
  await execAsync(
    `docker run --rm \-v ${workspace}:/workspace \gcc:14 \g++ /workspace/main.cpp -o /workspace/main`
  )
  console.log("compail")

  // 実行
  const { stdout, stderr } = await execAsync(
    `docker run --rm \-v ${workspace}:/workspace \gcc:14 \/workspace/main`
  )
  console.log("execute")

  return {
    stdout,
  }
}




