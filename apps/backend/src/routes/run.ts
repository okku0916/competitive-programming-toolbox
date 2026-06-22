import { Hono } from 'hono'
import type { RunRequest, RunResponse } from '@cpt/shared-types'





export const runRoute = new Hono();



// この関数が呼ばれるのはapi/runの時のみ
runRoute.post('/', async (c) => {
  const body = await c.req.json<RunRequest>()
  console.log("in runRoute Object!")
  console.log("language = ", body.language)
  console.log("sourceCOde = ", body.sourceCode)
  return c.json({
    received: body,
  })
})
