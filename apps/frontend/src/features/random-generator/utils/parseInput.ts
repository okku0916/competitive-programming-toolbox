import { Tokenizer } from "./tokenizer";
import { Parser } from "./parser";

export function parseInput(text: string) {
    const tokenizer = new Tokenizer(text);
    const tokens = tokenizer.tokenize();

    const parser = new Parser(tokens);

    const first = parser.expectIdentifier();
    const second = parser.expectIdentifier();
    const third = parser.expectSymbol("(");
    const fourth = parser.expectNumber();
    const fifth = parser.expectSymbol(",");
    const sixth = parser.expectNumber();
    const seventh = parser.expectSymbol(")");
    const eighth = parser.expectOption();

    return {
        first,
        second,
        third,
        fourth,
        fifth,
        sixth,
        seventh,
        eighth,
    };
}

const text = `int N(1, 100) @asc`;

console.log(parseInput(text));