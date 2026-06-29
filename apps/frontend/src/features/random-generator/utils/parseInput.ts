import { Tokenizer } from "./tokenizer";
import { Parser } from "./parser";

export function parseInput(text: string) {
    const tokenizer = new Tokenizer(text);
    const tokens = tokenizer.tokenize();

    const parser = new Parser(tokens);

    const test = parser.parseScalarConstraint();
    return test
}

const text = `int N(1, 100) @odd @even`;

console.log(parseInput(text));