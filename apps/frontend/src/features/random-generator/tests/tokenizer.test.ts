/// <reference types="node" />

import { test } from "node:test";
import assert from "node:assert/strict";
import { Tokenizer } from "../utils/tokenizer";

// ① 整数のトークン化
test("整数のDSLを正しく分割できる", () => {
    const tokens = new Tokenizer("int N(1,10);").tokenize();

    assert.deepStrictEqual(tokens, [
        { kind: "identifier", value: "int" },
        { kind: "identifier", value: "N" },
        { kind: "symbol", value: "(" },
        { kind: "number", value: 1 },
        { kind: "symbol", value: "," },
        { kind: "number", value: 10 },
        { kind: "symbol", value: ")" },
        { kind: "symbol", value: ";" },
        { kind: "eof" },
    ]);
});

// ② 配列のトークン化
test("配列のDSLを正しく分割できる", () => {
    const tokens = new Tokenizer("list(int) A[N](1,100);").tokenize();

    assert.deepStrictEqual(tokens, [
        { kind: "identifier", value: "list" },
        { kind: "symbol", value: "(" },
        { kind: "identifier", value: "int" },
        { kind: "symbol", value: ")" },
        { kind: "identifier", value: "A" },
        { kind: "symbol", value: "[" },
        { kind: "identifier", value: "N" },
        { kind: "symbol", value: "]" },
        { kind: "symbol", value: "(" },
        { kind: "number", value: 1 },
        { kind: "symbol", value: "," },
        { kind: "number", value: 100 },
        { kind: "symbol", value: ")" },
        { kind: "symbol", value: ";" },
        { kind: "eof" },
    ]);
});

// ③ オプションのトークン化
test("オプションを認識できる", () => {
    const tokens = new Tokenizer("@odd @even").tokenize();

    assert.deepStrictEqual(tokens, [
        { kind: "option", value: "odd" },
        { kind: "option", value: "even" },
        { kind: "eof" },
    ]);
});

// ④ 空白・改行の処理
test("空白や改行を無視できる", () => {
    const normal = new Tokenizer("int N(1,10);").tokenize();
    const spaced = new Tokenizer(
        " \n\t int  N ( 1 , 10 ) ; \n"
    ).tokenize();

    assert.deepStrictEqual(spaced, normal);
});

// ⑤ 空文字列の処理
test("空文字列を処理できる", () => {
    const tokens = new Tokenizer("").tokenize();

    assert.deepStrictEqual(tokens, [
        { kind: "eof" },
    ]);
});

// ⑥ 不正な文字の検出
test("不正な文字でエラーになる", () => {
    assert.throws(
        () => new Tokenizer("#").tokenize(),
        /Unexpected character: #/
    );
});