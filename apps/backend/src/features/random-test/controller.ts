// このファイルではHTTPの入出力処理を行う
// routesから呼び出される

import type { Context } from 'hono'
import { randomTesterCpp } from './randomTesterCpp.js';
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
type randomTestRequest = {
    sourceCode: string
    answerCode: string
    input: Constraint
    
}

// 型ContextはAPI通信の中身が全て入ったもの
export async function randomTestController(c: Context) {

  // awatでjson()が終わるのを待つ
  // c.reqでcのrequestを受け取る
  // .jsonでjson型の者を受け取れる
  const body = await c.req.json<randomTestRequest>()

  const result = await randomTesterCpp(body)

  return c.json(result)
}

