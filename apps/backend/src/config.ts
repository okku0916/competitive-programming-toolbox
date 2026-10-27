//環境変数をおく
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`環境変数 ${name} が設定されていません`);
  }
  return value;
}

//それぞれのpathの状況を保存
export const config = {
  containerWorkspace: "/workspace", //competitive-programming-toolboxコンテナ内の階層
  hostWorkspace: required("HOST_WORKSPACE"), // ホストPCの階層
  tmpDir: "/workspace/apps/backend/storage/tmp", // tmpフォルダの作成をする階層
};