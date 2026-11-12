
import { rejects } from "assert";
import { config } from "../config.js"
import { resolve } from "path";

let running = 0;

export let waitQueue = Array();

export function startRun(): Promise<void> {
    console.log("called start container", running);
    if(running < config.judge.MAX_CONCURRENCY){
        running ++;
        return Promise.resolve();
    }
    if(waitQueue.length < config.judge.MAX_QUEUE){
        // Promiseを作成してそのresolveをwaitQueueに入れる
        return new Promise<void>((resolve) => waitQueue.push(resolve))
    }
    return Promise.reject(new Error("busy error"));

}

export function endRun(){
    if(waitQueue.length > 0){
        // 待ち行列から次の待っているresolveを実行
        const next = waitQueue.shift();
        next();
    }else{
        running --;
    }
}

