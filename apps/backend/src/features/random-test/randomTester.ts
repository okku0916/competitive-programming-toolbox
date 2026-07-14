
import { mkdir, writeFile } from 'node:fs/promises'
import { exec, spawn } from 'node:child_process'
import { promisify } from 'node:util'

// 標準出力の方のようなもの
// Exec Asynchronous 非同期にするためのもの
// そのままではawaitを使えない
const execAsync = promisify(exec)

type ScalarConstraint = {
  kind: "scalar";
  typeName: string;
  name: string;
  min: number;
  max: number;
  options: string[];
};

type Length =
  | { kind: "number"; value: number }
  | { kind: "variable"; name: string };

type ListConstraint = {
    kind: "list";
    elementType: string;
    name: string;
    length: Length;
    min: number;
    max: number;
    options: string[];
  };
  
type Constraint = ScalarConstraint | ListConstraint;
type RandomTestRequest = {
    sourceCode: string
    answerCode: string
    input: Constraint
    
}

function generator(c:Constraint): string{return "3"}//random-geneartorで作ってもらう

export async function randomTester(req: RandomTestRequest){
    const answerCode = req.answerCode;
    const sourceCode = req.sourceCode;
    const answerFileName = "answer.cpp";
    const sourceFileName = "source.cpp";
    const maxExecuteNum = 100;

    // docker内で/storage/tmpのフォルダを参照できるようにworkspaceを定義
    // process.cwd()で現在の階層の位置を返す
    const workspace = `${process.cwd()}/storage/tmp`
    // ディレクトリが存在しない場合は作成
    await mkdir(workspace, { recursive: true })

    //ファイル書き込み
    await writeFile('./storage/tmp/' + answerFileName, answerCode)
    await writeFile('./storage/tmp/' + sourceFileName, sourceCode)


    //コンパイル(docker)
    // コンパイル
  try{
    await execAsync(
    // --rmは実行後にdockerを閉じる
    // --mountでdockerの中とフォルダを紐付け,  docker run --mount type=bind,src=<host-path>,dst=<container-path>
    // gcc:14はDockerイメージ 
    // g++ ....で実行コマンド
    `docker run --rm --mount type=bind,src=${workspace},dst=/workspace gcc:14 g++ 
    /workspace/${answerFileName} /workspace/${sourceFileName} -o /workspace/main`
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
  let answerStdout = "";
  let answerStderr = "";
  let sourceStdout = "";
  let sourceStderr = "";
  container.stdout.on("data", (data: Buffer) => {
    stdout += data.toString();
        });
  // stderrを監視
  container.stderr.on("data", (data: Buffer) => {
    stderr += data.toString();
  });

  for(let cnt = 0; cnt < maxExecuteNum; cnt ++){
    // spawn(command, [,args][,option])で利用

    const randomStdin = generator(req.input);
    container.stdin.write("echo __BEGIN__ANSWER__");
    container.stdin.write("/workspace/" + answerFileName +"\n")
    container.stdin.write(randomStdin);
    container.stdin.write("echo __END__ANSWER__");
    answerStdout = stdout;


    container.stdin.write("echo __BEGIN__SOURCE__");
    container.stdin.write("/workspace/" + sourceFileName + "\n")
    container.stdin.write(randomStdin);
    container.stdin.write("echo __END__SOURCE__\n");
    sourceStdout = stdout;

    if(answerStdout == answerStderr){
        return randomStdin;
    }
    
    

    
  }
  console.log(stdout)
  container.stdin.end()
  
  
  





}

const input: RandomTestRequest = {
    sourceCode: '#include <iostream>\nusing namespace std;\nint main(){int N; cin >> N; cout << "hello1" << endl;}',
    answerCode: '#include <iostream>\nusing namespace std;\nint main(){int N; cin >> N; cout << "hello2" << endl;}',
    input: {
        kind: "scalar",
        typeName: "int",
        name: "x",
        min: 1,
        max: 100,
        options: []
    }


}


console.log(randomTester(input))