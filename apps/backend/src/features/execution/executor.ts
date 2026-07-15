// このファイルでファイルに保存, コンパイル, 実行を行う


// child_processとはNode.jsでサブプロセス（子プロセス）を作成し、
// メインのNode.jsプロセスから独立してコマンドやプログラムを実行するための機能を提供。
import { exec, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdir, writeFile } from 'node:fs/promises'
//dirのpathを取得
import path from "node:path"
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspace = path.join(__dirname, "../../../storage/tmp");


// 標準出力の方のようなもの
// Exec Asynchronous 非同期にするためのもの
// そのままではawaitを使えない
const execAsync = promisify(exec)

export async function compileCpp(sourceCode: string, fileName: string) {
  // docker内で/storage/tmpのフォルダを参照できるようにworkspaceを定義
  // process.cwdで現在の階層の位置を返す
  // __dirnameはこのファイルのdirを示す(executionフォルダ)
  // const workspace = path.join(__dirname ,"../../../storage/tmp")
  console.log(workspace)
  // ディレクトリが存在しない場合は作成
  await mkdir(workspace, { recursive: true })
  // sourceCodeをtmpの中にかく(ファイルを作成)
  await writeFile(`${workspace}/${fileName}.cpp`, sourceCode)

  // コンパイル
  try{
    await execAsync(
    // --rmは実行後にdockerを閉じる
    // --mountでdockerの中とフォルダを紐付け,  docker run --mount type=bind,src=<host-path>,dst=<container-path>
    // gcc:14はDockerイメージ 
    // g++ ....で実行コマンド
    `docker run --rm --mount type=bind,src=${workspace},dst=/workspace gcc:14 g++ /workspace/${fileName}.cpp -o /workspace/${fileName}`
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

}

export async function executeCpp(fileName: string, stdin: string) {

  // const workspace = path.join(__dirname ,"../../../storage/tmp")
  // 実行
  // spawn(command, [,args][,option])で利用
  const child = spawn("docker", [
    "run",
    "--rm",
    "-i", // stdinを有効化
    "--mount",
    `type=bind,src=${workspace},dst=/workspace`,
    "gcc:14",
    `/workspace/${fileName}`
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




