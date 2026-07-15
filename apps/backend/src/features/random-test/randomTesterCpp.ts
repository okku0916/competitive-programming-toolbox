
import { mkdir, writeFile } from 'node:fs/promises'
import { exec, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import type { Constraint } from '@cpt/shared-types'
import { generaterController } from '../random-generator/controller.js'


// 標準出力の型のようなもの
// Exec Asynchronous 非同期にするためのもの
// そのままではawaitを使えない
const execAsync = promisify(exec)

type RandomTestRequest = {
    sourceCode: string
    sourceCodeLanguage: string
    answerCode: string
    answerCodeLanguage: string
    input: Constraint
    
}





export async function randomTesterCpp(req: RandomTestRequest){
    const answerCode = req.answerCode;
    const sourceCode = req.sourceCode;
    const answerFileName = "answer";
    const sourceFileName = "source";
    const maxExecuteNum = 100;

    // docker内で/storage/tmpのフォルダを参照できるようにworkspaceを定義
    // process.cwd()で現在の階層の位置を返す
    const workspace = `${process.cwd()}/storage/tmp`
    // ディレクトリが存在しない場合は作成
    await mkdir(workspace, { recursive: true })

    //ファイル書き込み
    await writeFile(`${workspace}/${answerFileName}.cpp`, answerCode)
    await writeFile(`${workspace}/${sourceFileName}.cpp`, sourceCode)


    //コンパイル(docker)
    // コンパイル
  try{
    await execAsync(
    // --rmは実行後にdockerを閉じる
    // --mountでdockerの中とフォルダを紐付け,  docker run --mount type=bind,src=<host-path>,dst=<container-path>
    // gcc:14はDockerイメージ 
    // g++ ....で実行コマンド
    `docker run --rm --mount type=bind,src=${workspace},dst=/workspace gcc:14 g++ /workspace/${answerFileName}.cpp -o /workspace/${answerFileName}`
    )
    await execAsync(
    // --rmは実行後にdockerを閉じる
    // --mountでdockerの中とフォルダを紐付け,  docker run --mount type=bind,src=<host-path>,dst=<container-path>
    // gcc:14はDockerイメージ 
    // g++ ....で実行コマンド
    `docker run --rm --mount type=bind,src=${workspace},dst=/workspace gcc:14 g++ /workspace/${sourceFileName}.cpp -o /workspace/${sourceFileName}`
    )
  }catch(err: any){//コンパイルエラーを検知
    console.log("compile Err");

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

  //実行
  const container = spawn("docker", [
    "run",
    "--rm",
    "-i",
    "--mount",
    `type=bind,src=${workspace},dst=/workspace`,
    "gcc:14",
    "bash",
  ]);
  let stdout = "";
  let stderr = "";
  let randomInputs = [];


  container.stdout.on("data", (data: Buffer) => {
    stdout += data.toString();
        });
  // stderrを監視
  container.stderr.on("data", (data: Buffer) => {
    stderr += data.toString();
  });

  for(let cnt = 0; cnt < maxExecuteNum; cnt ++){
    // spawn(command, [,args][,option])で利用
    // console.log(cnt);

    const randomStdin = generaterController(req.input);
    console.log(randomStdin);
    // const randomStdin = cnt;
    randomInputs.push(randomStdin);

    container.stdin.write("echo __BEGIN__ANSWER__\n");
    await container.stdin.write(
      `echo ${randomStdin} | /workspace/${answerFileName}\n`//標準入力を渡して実行
    );
    container.stdin.write("echo __END__ANSWER__\n");



    container.stdin.write("echo __BEGIN__SOURCE__\n");
    await container.stdin.write(
      `echo ${randomStdin} | /workspace/${sourceFileName}\n`
    );
    container.stdin.write("echo __END__SOURCE__\n");
    
    

    
  }

  // console.log(stdout)
  container.stdin.end()
  await new Promise<number>((resolve) => {
    container.on("close", resolve);
  });

  let answerStdout;
  let sourceStdout;
  const stdoutList = stdout.split("\n");
  let idx = 0;
  for(let cnt = 0; cnt < maxExecuteNum; cnt ++){
    answerStdout = "";
    sourceStdout = "";
    if(stdoutList[idx] == "__BEGIN__ANSWER__"){
      idx ++;

      while(stdoutList[idx] != "__END__ANSWER__"){
        if(!stdoutList[idx]){
          return "ERR..."
        }
        // console.log(stdoutList[idx]);
        answerStdout += stdoutList[idx] + "\n";
        idx ++;
      }
    }else{
      return "ERROR!!"
    }
    idx ++;
    if(stdoutList[idx] == "__BEGIN__SOURCE__"){
      idx ++;
      while(stdoutList[idx] != "__END__SOURCE__"){
        sourceStdout += stdoutList[idx] + "\n";
        idx ++;
      }
    }else{
      return "EROOR"
    }
    console.log(cnt);
    console.log(answerStdout)
    console.log(sourceStdout)
    idx ++;
    if(answerStdout != sourceStdout){
      return randomInputs[cnt];
    }
  }



  return "not found WA case...";
  
  
  





}

const input: RandomTestRequest = {
    sourceCode: '#include <iostream>\nusing namespace std;\nint main(){int N; cin >> N; cout << "hello1: " << N << endl;}',
    sourceCodeLanguage: "c++",

    answerCode: '#include <iostream>\nusing namespace std;\nint main(){int N; cin >> N; cout << "hello: " << N << endl;}',
    answerCodeLanguage: "c++",
    input: {
        kind: "scalar",
        typeName: "int",
        name: "x",
        min: 1,
        max: 100,
        options: []
    }


}


const result = await randomTesterCpp(input)
console.log(result)