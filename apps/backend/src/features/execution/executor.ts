// このファイルでファイルに保存, コンパイル, 実行を行う


// child_processとはNode.jsでサブプロセス（子プロセス）を作成し、
// メインのNode.jsプロセスから独立してコマンドやプログラムを実行するための機能を提供。
import { exec, spawn } from 'node:child_process'
import { promisify } from 'node:util'

import { writeFile } from 'node:fs/promises'



// 標準出力の方のようなもの
// Exec Asynchronous 非同期にするためのもの
// そのままではawaitを使えない
const execAsync = promisify(exec)

export async function executeCpp(sourceCode: string, stdin: string) {
//   sourceCodeをtmpの中にかく(ファイルを作成)
  await writeFile('./storage/tmp/main.cpp', sourceCode)

// docker内で/Storage/tmpのフォルダを参照できるようにworkspaceを定義
// process.cwdで現在の階層の位置を返す
  const workspace = `${process.cwd()}/storage/tmp`

  // コンパイル
  try{
    await execAsync(
    // --rmは実行後にdockerを閉じる
    // --mountでdockerの中とフォルダを紐付け,  docker run --mount type=bind,src=<host-path>,dst=<container-path>
    // gcc:14はDockerイメージ 
    // g++ ....で実行コマンド
    `docker run --rm --mount type=bind,src=${workspace},dst=/workspace gcc:14 g++ /workspace/main.cpp -o /workspace/main`
  )

  }catch(err: any){//コンパイルエラーを検知
    console.log("compile Err");
    // 型アサーション: asは型が元からわかっている時にその型を支えるようにする
    // 型変換を行っているのではなくeの型をtsが認識できるようにしている
    //   実際のエラーの型:
    //   {
    //   name: "Error",
    //   message: "...",
    //   code: 1,
    //   stdout: "",
    //   stderr: "...",
    // }
    const e = err as Error & {
      code: number;
      stdout: string;
      stderr: string;
    };


    return {
      stdout: e.stdout,
      stderr: e.stderr,
      exitCode: e.code,
    };
  }


  // console.log("compail")

  // 実行
  // spawn(command, [,args][,option])で利用
  const child = spawn("docker", [
    "run",
    "--rm",
    "-i", // stdinを有効化
    "--mount",
    `type=bind,src=${workspace},dst=/workspace`,
    "gcc:14",
    "/workspace/main"
  ]);
  let stdout = "";
  let stderr = "";

//   stdoutを監視する
  child.stdout.on("data", (data: Buffer) => {
  stdout += data.toString();
    });

// stderrを監視
  child.stderr.on("data", (data: Buffer) => {
    stderr += data.toString();
  });

//   
  child.stdin.write(stdin);
  child.stdin.end();

  const exitCode = await new Promise<number>((resolve) => {
    child.on("close", resolve);
  });

  return {
    stdout,stderr, exitCode
  }
}




