import type { Token } from "./tokenizer";

export type ScalarConstraint = {
  kind: "scalar";
  typeName: string;
  name: string;
  min: number;
  max: number;
  options: string[];
};

type Length =
  | { kind: "number"; value: number }
  | { kind: "variable"; name: string };

export type ListConstraint = {
    kind: "list";
    elementType: string;
    name: string;
    length: Length;
    min: number;
    max: number;
    options: string[];
  };
  
export type Constraint = ScalarConstraint | ListConstraint;

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

    expectLength(): Length {
        const token = this.now();
    
        if (token.kind === "number") {
            return {
                kind: "number",
                value: this.expectNumber(),
            };
        }
    
        if (token.kind === "identifier") {
            return {
                kind: "variable",
                name: this.expectIdentifier(),
            };
        }
    
        throw new Error("Expected length");
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

    parseListConstraint(): ListConstraint {
        const listKeyword = this.expectIdentifier();

        if (listKeyword !== "list") {
            throw new Error(`Expected list, but got ${listKeyword}`);
        }

        this.expectSymbol("(");
        const elementType = this.expectIdentifier();

        if (!isTypeName(elementType)) {
            throw new Error(`Expected element type, but got ${elementType}`);
        }

        this.expectSymbol(")");
        const name = this.expectIdentifier();
        this.expectSymbol("[");
        const length = this.expectLength();
        this.expectSymbol("]");
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
            kind: "list",
            elementType,
            name,
            length,
            min,
            max,
            options,
        };
    }

    parseConstraint(): Constraint {
        const token = this.now();

        if (token.kind === "identifier" && token.value === "list") {
            return this.parseListConstraint();
        }

        return this.parseScalarConstraint();
    }

    parseConstraints(): Constraint[] {
        const constraints: Constraint[] = [];

        while (!this.isEnd()) {
            const constraint = this.parseConstraint();
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
}