import { Hono } from 'hono'



export const runRoute = new Hono();

// この関数が呼ばれるのはapi/runの時のみ
runRoute.post('/', async (c) => {
  const body = await c.req.json()
  console.log("in runRoute Object!")
  return c.json({
    received: body,
  })
})
