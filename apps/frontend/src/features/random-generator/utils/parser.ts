import type { Token } from "./tokenizer";

export type ScalarConstraint = {
  kind: "scalar";
  typeName: string;
  name: string;
  min: number;
  max: number;
  options: string[];
};

export type Constraint = ScalarConstraint;

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

  parseConstraints(): Constraint[] {
    const constraints: Constraint[] = [];

    while (!this.isEnd()) {
        const constraint = this.parseScalarConstraint();
        constraints.push(constraint);

        const token = this.now();

        if (token.kind === "symbol" && token.value === ";") {
            this.expectSymbol(";");
            continue;
        }

        if (!this.isEnd()) {
            throw new Error(`Expected ; or EOF`);
        }
    }

    return constraints;
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

  parseScalarConstraint(): ScalarConstraint {
    const typeName = this.expectIdentifier();

    if (!isTypeName(typeName)) {
        throw new Error(`Expected type name, but got ${typeName}`);
    }

    const name = this.expectIdentifier();

    this.expectSymbol("(");
    const min = this.expectNumber();
    this.expectSymbol(",");
    const max = this.expectNumber();
    this.expectSymbol(")");

    const options: string[] = [];

    while (this.now().kind === "option") {
        options.push(this.expectOption());
    }

    return {
        kind: "scalar",
        typeName,
        name,
        min,
        max,
        options,
    };
}
}