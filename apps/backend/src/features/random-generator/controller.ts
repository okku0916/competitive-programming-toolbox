// このファイルではHTTPの入出力処理を行う
// routesから呼び出される
// json形式からデータを取り出す

import type { Context } from 'hono'
// import { executeCode } from './service.js'
import type { Constraint } from '@cpt/shared-types'
import { generateInput } from './service.js';

// 型ContextはAPI通信の中身が全て入ったもの
export async function generaterController(c: Context) {

  // awatでjson()が終わるのを待つ
  // c.reqでcのrequestを受け取る
  // .jsonでjson型の者を受け取れる
  let result = "";
  const body = await c.req.json<Constraint[]>()
  return c.json(generateInput(body));

}

