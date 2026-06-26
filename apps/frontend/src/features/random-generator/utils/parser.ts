import type { Token } from "./tokenizer";

export type ScalarConstraint = {
  kind: "scalar";
  typeName: string;
  name: string;
  min: number;
  max: number;
  options: string[];
};

// List of supported type names
const TYPE_NAMES = ["int", "float", "double", "str"];

// Check if a string is a supported type name
function isTypeName(s: string): boolean {
  return TYPE_NAMES.includes(s);
}

// Read tokens and build parsed structure
export class Parser {
  private tokens: Token[];
  private pos: number;

  // Initialize parser with token array
  constructor(tokens: Token[]) {
      this.tokens = tokens;
      this.pos = 0;
  }

  // Get current token
  now(): Token {
      return this.tokens[this.pos] ?? { kind: "eof" };
  }

  // Get next token
  next(): Token {
      return this.tokens[this.pos + 1] ?? { kind: "eof" };
  }

  // Move to next token
  advance(): void {
      this.pos++;
  }

  // Check if parser reached eof token
  isEnd(): boolean {
      return this.now().kind === "eof";
  }

  // Read current token as identifier
  expectIdentifier(): string {
      const token = this.now();

      if (token.kind !== "identifier") {
          throw new Error(`Expected identifier`);
      }

      this.advance();
      return token.value;
  }

  // Read current token as expected symbol
  expectSymbol(expected: string): string {
      const token = this.now();

      if (token.kind !== "symbol" || token.value !== expected) {
          throw new Error(`Expected symbol ${expected}`);
      }

      this.advance();
      return token.value;
  }

  // Read current token as number
  expectNumber(): number {
      const token = this.now();

      if (token.kind !== "number") {
          throw new Error(`Expected number`);
      }

      this.advance();
      return token.value;
  }

  // Read current token as option
  expectOption(): string {
      const token = this.now();

      if (token.kind !== "option") {
          throw new Error(`Expected option`);
      }

      this.advance();
      return token.value;
  }
}