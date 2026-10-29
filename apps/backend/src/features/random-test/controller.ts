// このファイルではHTTPの入出力処理を行う
// routesから呼び出される

import type { Context } from 'hono'
import { manegementRandomTest } from './service.js';
import type { CodeTestRequest } from '@cpt/shared-types';


// 型ContextはAPI通信の中身が全て入ったもの
export async function randomTestController(c: Context) {

  // awatでjson()が終わるのを待つ
  // c.reqでcのrequestを受け取る
  // .jsonでjson型の者を受け取れる
  const body = await c.req.json<CodeTestRequest>()

  const result = await manegementRandomTest(body)

  return c.json(result)
}

