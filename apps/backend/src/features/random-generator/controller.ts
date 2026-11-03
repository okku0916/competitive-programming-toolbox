// このファイルではHTTPの入出力処理を行う
// routesから呼び出される
// json形式からデータを取り出す

import type { Context } from 'hono'
// import { executeCode } from './service.js'
import type { Constraint } from '@cpt/shared-types'
import { generateInput } from './service.js';
import { InputValidationError } from './errors.js';

// 型ContextはAPI通信の中身が全て入ったもの
export async function generaterController(c: Context) {

  // awatでjson()が終わるのを待つ
  // c.reqでcのrequestを受け取る
  // .jsonでjson型の者を受け取れる
  try {
    const body = await c.req.json<Constraint[]>()
    return c.json(generateInput(body));
  } catch (e) {
    // 生成エラーを受け取ったら、http400番でエラー文を返す
    if (e instanceof InputValidationError) {
      return c.json(e.message, 400);
    }
    // 想定外のエラーを捕捉したら500番で返す
    console.error(e);
    return c.json("サーバー内部でエラーが発生しました。", 500);
  }
}

