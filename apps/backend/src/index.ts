// このファイルではサーバー起動と共通設定だけを書く。

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
// tsファイルはコンパイル後にjsになるためjs拡張子でimport
import { executionRoute } from './features/execution/route.js'

const app = new Hono()


// すべてのリクエストに対して、CORS用のヘッダを付ける共通処理を追加
//CORSとはCross-Origin Resource Sharing：オリジン間リソース共有:
// 異なるドメイン間でのデータ共有を安全に可能にするWebセキュリティの仕組み

//ここでアクセスを許可
//現在はlocalhost5173のみアクセス可能
app.use(
  '*',//全てのリクエストに対して反応する/, /testなど
  cors({
    origin: 'http://localhost:5173',//localhost:5173 からのアクセスを許可
  })
)
// 全てのアドレスから許可を出すには
// app.use('*', cors())


//getリクエストに対応
//http://localhost:3000/にアクセスしたときなど
// '/'はURLのパス (c)は関数
app.get('/test', (c) => {
  return c.text('Hello Hono!')
})


//postリクエストを受け取ってそれに対してexecutionRouteオブジェクトを利用
app.route('/api/run', executionRoute)






//サーバーを起動
//fetch: app.listenのようなもの, 待ち受ける状態にしている。
//port: 後悔するポート
serve({
  fetch: app.fetch,
  port: 3000,
})

console.log('Server running on port 3000')