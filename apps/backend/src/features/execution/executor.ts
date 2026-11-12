// このファイルでファイルに保存, コンパイル, 実行を行う


// child_processとはNode.jsでサブプロセス（子プロセス）を作成し、
// メインのNode.jsプロセスから独立してコマンドやプログラムを実行するための機能を提供。
import { ChildProcess, execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdir, writeFile, rm } from 'node:fs/promises'


import { toHostPath } from '../../lib/docker.js'


//dirのpathを取得
import path, { resolve } from "node:path"
import { fileURLToPath } from "node:url";
import { exitCode, stderr, stdout } from 'node:process';
import type { RunResponse } from '@cpt/shared-types';
import { rejects } from 'node:assert'
import { error } from 'node:console'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// docker内で/storage/tmpのフォルダを参照できるようにworkspaceを定義
const workspace = path.join(__dirname, "../../../storage/tmp");

// 標準出力の方のようなもの
// Exec Asynchronous 非同期にするためのもの
// そのままではawaitを使えない
const execFileAsync = promisify(execFile)


export async function startContainer(folderName: string):Promise<string> {
  //-i 入力を受け取る, 
  const {stdout} = await execFileAsync("docker", 
    ["run", "-itd", "--mount", `type=bind,src=${toHostPath(workspace)}/${folderName},dst=/workspace`, "gcc:14"])

  return stdout.replace("\n", "");
}

export async function stopContainer(containerID: string) {
  await execFileAsync("docker",  ["rm", "-f", containerID]) //強制終了
}

export async function makeFileCpp(fileName: string, sourceCode: string, codeLanguage: string, folderName: string) {
  console.log("called makeFileCpp")
  // __dirnameはこのファイルのdirを示す(executionフォルダ)
  // const workspace = path.join(__dirname ,"../../../storage/tmp")
  // ディレクトリが存在しない場合は作成
  await mkdir(`${workspace}/${folderName}`, { recursive: true })

  let extension;
  switch(codeLanguage){
    case "c++":
      extension = "cpp";
      break;
    case "python":
      extension = "py";
      break;
    default:
      console.log("language error");
      extension = "cpp";
  }


  // sourceCodeをtmpの中にかく(ファイルを作成)
  await writeFile(`${workspace}/${folderName}/${fileName}.${extension}`, sourceCode)
}

export async function removeFolder(folderName: string){
  await rm(`${workspace}/${folderName}`, { recursive: true, force: true })
}



export async function compileCpp(fileName: string, containerID: string): Promise<RunResponse> {
  // コンパイル
  try{
    await execFileAsync(
    // g++ ....で実行コマンド
    "docker",
    ["exec", containerID, "g++", `/workspace/${fileName}.cpp`, "-o", `/workspace/${fileName}`]);

    return {//正常終了
      stdout: "",
      stderr: "",
      exitCode: 0,
    };
  }catch(err: any){//コンパイルエラーを検知
    // console.log("compile Err in compileCpp");
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


const TIME_LIMIT = 10
const MAX_OUTPUT = 10**6

export async function executeCpp(fileName: string, stdin: string, containerID: string):Promise<RunResponse> {
  // 実行
  // trt-catchではspawnの非同期エラーに対応できないためresolveを使用(結果を待つ)
  /// 正常終了でresolveを返却, 以上終了でrejectを返却
  return new Promise((resolve, reject) => {
    const child = spawn("docker", [
      "exec", "-i", // stdinを有効化
      containerID,
      //2秒でtimeout, -s KILLでprogramでタイムアウト処理を止めれないようにする
      "timeout", "-s", "KILL", String(TIME_LIMIT),
      `/workspace/${fileName}`
    ]);
    
    let stdout = "";
    let stderr = "";

    //   stdoutを監視する
    child.stdout.on("data", (data: Buffer) => {
      if(stdout.length < MAX_OUTPUT) stdout += data.toString();
      });

    // stderrを監視
    child.stderr.on("data", (data: Buffer) => {
      if(stderr.length < MAX_OUTPUT) stderr += data.toString();
    });

    // spawn 自体の失敗(docker が見つからないなど)
    child.on("error", (err) => {
      reject(err);
    });

    //  標準入力を行う 
    child.stdin.write(stdin);
    // 標準入力を閉じる
    child.stdin.end();

    // closeでchildが終了した際に呼ばれる
    // childのexitCode(正常終了で-1)
    console.log(stderr);
    child.on("close", (code)=>{
      if(code == 137){
        console.log("TLE");
        stderr = "Time Limit Exceeded";
      }
      resolve({
        stdout,
        stderr,
        exitCode: code ?? -1,  // //number以外の値(null, undefinedで-1);
      });
    })
  })
}





