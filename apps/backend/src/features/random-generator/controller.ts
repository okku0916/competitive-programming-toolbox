// このファイルではHTTPの入出力処理を行う
// routesから呼び出される
// json形式からデータを取り出す

import type { Context } from 'hono'
// import { executeCode } from './service.js'
import type { Constraint } from '@cpt/shared-types'
import { generateScalar, generateList } from './generator.js';

// 型ContextはAPI通信の中身が全て入ったもの
export async function generaterController(c: Context) {

  // awatでjson()が終わるのを待つ
  // c.reqでcのrequestを受け取る
  // .jsonでjson型の者を受け取れる
  let result = "";
  const body = await c.req.json<Constraint[]>()

  for(let i = 0; i < body.length; i ++){
    const constraint = body[i];
    if (constraint.kind === "list") {
      result += generateList(constraint) + "\n";
    }
    if(constraint.kind == "scalar"){
      result += generateScalar(constraint) + "\n";
    }
  }
  return c.json(result)
}

