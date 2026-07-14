
// このファイルでURLとControllerを結びつける
// api/run/...の中身が増えた時にこのファイルで分割する。
// 現在はapi/runのみなのでほとんど必要ない...

import { Hono } from 'hono'
import { generaterController } from './controller.js';
// import type { RunRequest, RunResponse } from '@cpt/shared-types'

export const randomGeneratorRoute = new Hono();

// この関数が呼ばれるのはapi/runの時のみ(index.tsからその時に繋がれる)
randomGeneratorRoute.post('/', generaterController)


