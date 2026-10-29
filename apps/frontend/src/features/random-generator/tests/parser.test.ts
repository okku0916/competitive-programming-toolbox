/// <reference types="node" />

import { test } from "node:test";
import assert from "node:assert/strict";
import { Tokenizer } from "../utils/tokenizer";
import { Parser } from "../utils/parser";

// DSLを解析する共通関数
function parse(input: string) {
    const tokens = new Tokenizer(input).tokenize();
    return new Parser(tokens).parseConstraints();
}

// ① 整数の制約
test("整数の制約を解析できる", () => {
    const result = parse("int N(1,10);");

    assert.deepStrictEqual(result, [
        {
            kind: "scalar",
            typeName: "int",
            name: "N",
            min: 1,
            max: 10,
            options: [],
        },
    ]);
});

// ② オプション付きの制約
test("オプションを解析できる", () => {
    const result = parse("int N(1,10) @odd;");

    assert.deepStrictEqual(result, [
        {
            kind: "scalar",
            typeName: "int",
            name: "N",
            min: 1,
            max: 10,
            options: ["odd"],
        },
    ]);
});

// ③ 固定長配列
test("固定長配列を解析できる", () => {
    const result = parse("list(int) A[5](1,100);");

    assert.deepStrictEqual(result, [
        {
            kind: "list",
            elementType: "int",
            name: "A",
            length: {
                kind: "number",
                value: 5,
            },
            min: 1,
            max: 100,
            options: [],
        },
    ]);
});

// ④ 変数長配列
test("変数長配列を解析できる", () => {
    const result = parse("list(int) A[N](1,100);");

    assert.deepStrictEqual(result, [
        {
            kind: "list",
            elementType: "int",
            name: "A",
            length: {
                kind: "variable",
                name: "N",
            },
            min: 1,
            max: 100,
            options: [],
        },
    ]);
});

// ⑤ 複数の制約
test("複数の制約を解析できる", () => {
    const result = parse(`
        int N(1,10);
        list(int) A[N](1,100);
    `);

    assert.equal(result.length, 2);
    assert.equal(result[0].kind, "scalar");
    assert.equal(result[1].kind, "list");
});

// ⑥ 不正な構文
test("不正な構文でエラーになる", () => {
    assert.throws(() => {
        parse("int N(1,10;");
    });
});

// ⑦ 未定義の型
test("未定義の型でエラーになる", () => {
    assert.throws(() => {
        parse("unknown N(1,10);");
    });
});

// ⑧ 負数の解析
test("負数を含む制約を解析できる", () => {
  const result = parse("int N(-10,10);");

  assert.deepStrictEqual(result, [
      {
          kind: "scalar",
          typeName: "int",
          name: "N",
          min: -10,
          max: 10,
          options: [],
      },
  ]);
});

// ⑨ 小数の解析
test("小数を含む制約を解析できる", () => {
  const result = parse("float X(0.5,1.5);");

  assert.deepStrictEqual(result, [
      {
          kind: "scalar",
          typeName: "float",
          name: "X",
          min: 0.5,
          max: 1.5,
          options: [],
      },
  ]);
});

// ⑩ 負の小数の解析
test("負の小数を含む制約を解析できる", () => {
  const result = parse("double Y(-10.5,10.5);");

  assert.deepStrictEqual(result, [
      {
          kind: "scalar",
          typeName: "double",
          name: "Y",
          min: -10.5,
          max: 10.5,
          options: [],
      },
  ]);
});