export type Token =
    | { kind: "identifier"; value: string }
    | { kind: "number"; value: number }
    | { kind: "symbol"; value: string }
    | { kind: "option"; value: string }
    | { kind: "eof" };

// Convert input string into tokens
export class Tokenizer {
  private text: string;
  private pos: number;

  // Initialize tokenizer with input text
  constructor(text: string) {
      this.text = text;
      this.pos = 0;
  }

  // Get current character
  now(): string {
      return this.text[this.pos] ?? "";
  }

  // Get next character
  next(): string {
      return this.text[this.pos + 1] ?? "";
  }

  // Move to next character
  advance(): void {
      this.pos++;
  }

  // Check if tokenizer reached the end
  isEnd(): boolean {
      return this.pos >= this.text.length;
  }

  // Check if character is a letter or underscore
  isAlpha(c: string): boolean {
      return /^[A-Za-z_]$/.test(c);
  }

  // Check if character is a digit
  isDigit(c: string): boolean {
      return /^[0-9]$/.test(c);
  }

  // Check if character is a letter, digit, or underscore
  isAlphaNumeric(c: string): boolean {
      return /^[A-Za-z0-9_]$/.test(c);
  }

  // Check if character is a supported symbol
  isSymbol(c: string): boolean {
      return "()[],+-*/^".includes(c);
  }
  
  // Skip spaces, tabs, and newlines
  skipWhitespace(): void {
      while (!this.isEnd() && /\s/.test(this.now())) {
          this.advance();
      }
  }

  // Read an identifier such as int, N, or list
  readIdentifier(): string {
      let result = "";
      while (!this.isEnd() && this.isAlphaNumeric(this.now())) {
          result += this.now();
          this.advance();
      }
      return result;
  }

  // Read a number such as 1 or 100
  readNumber(): number {
      let result = "";
  
      while (!this.isEnd() && this.isDigit(this.now())) {
          result += this.now();
          this.advance();
      }
  
      return Number(result);
  }

  // Read an option such as @asc
  readOption(): string {
      this.advance(); // @ を読み飛ばす
  
      let result = "";
  
      while (!this.isEnd() && this.isAlphaNumeric(this.now())) {
          result += this.now();
          this.advance();
      }
  
      return result;
  }

  // Convert all input text into token array
  tokenize(): Token[] {
      const tokens: Token[] = [];
  
      while (!this.isEnd()) {
          const c = this.now();
  
          if (/\s/.test(c)) {
              this.skipWhitespace();
              continue;
          }
  
          if (this.isAlpha(c)) {
              tokens.push({
                  kind: "identifier",
                  value: this.readIdentifier(),
              });
              continue;
          }
  
          if (this.isDigit(c)) {
              tokens.push({
                  kind: "number",
                  value: this.readNumber(),
              });
              continue;
          }
  
          if (this.isSymbol(c)) {
              tokens.push({
                  kind: "symbol",
                  value: c,
              });
              this.advance();
              continue;
          }
  
          if (c === "@") {
              tokens.push({
                  kind: "option",
                  value: this.readOption(),
              });
              continue;
          }
  
          throw new Error(`Unexpected character: ${c}`);
      }
  
      tokens.push({ kind: "eof" });
      return tokens;
  }

}