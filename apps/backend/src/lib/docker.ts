import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { config } from "../config.js";

const execFileAsync = promisify(execFile);

// docker内のフォルダからHostのpcアドレスに変換
export function toHostPath(containerPath: string): string {
  const relative = path.relative(config.containerWorkspace, containerPath);
//   以下のように変換する関数(パスからパスへの相対パスを得る)
//   path.relative("/workspace", "/workspace/apps/backend/storage/tmp/abc") => "apps/backend/storage/tmp/abc"
  return path.join(config.hostWorkspace, relative);
}