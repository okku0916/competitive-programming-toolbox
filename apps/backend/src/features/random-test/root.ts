
// このファイルでURLとControllerを結びつける
// api/run/...の中身が増えた時にこのファイルで分割する。
// 現在はapi/runのみなのでほとんど必要ない...

import { Hono } from 'hono'
import type { RunRequest, RunResponse } from '@cpt/shared-types'
import { randomTestController } from './controller.js';

export const executionRoute = new Hono();

// この関数が呼ばれるのはapi/random-testの時のみ(index.tsからその時に繋がれる)
executionRoute.post('/', randomTestController)


