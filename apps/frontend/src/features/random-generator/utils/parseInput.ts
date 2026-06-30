import { Tokenizer } from "./tokenizer";
import { Parser } from "./parser";

export function parseInput(text: string) {
    const tokenizer = new Tokenizer(text);
    const tokens = tokenizer.tokenize();

    const parser = new Parser(tokens);

    return parser.parseConstraints();
}

const text = `
int N(1, 100) @odd;
int M(1, 10);
`;

console.log(parseInput(text));