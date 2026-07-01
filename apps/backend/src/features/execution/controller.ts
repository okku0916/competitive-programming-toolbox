// このファイルではHTTPの入出力処理を行う
// routesから呼び出される

import type { Context } from 'hono'
import { executeCode } from './service.js'
import type { RunRequest } from '@cpt/shared-types'

// 型ContextはAPI通信の中身が全て入ったもの
export async function executionController(c: Context) {

  // awatでjson()が終わるのを待つ
  // c.reqでcのrequestを受け取る
  // .jsonでjson型の者を受け取れる
  const body = await c.req.json<RunRequest>()

  const result = await executeCode(body)

  return c.json(result)
}

