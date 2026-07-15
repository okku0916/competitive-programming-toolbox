import type { Constraint } from "./parser.js";

export type CodeTestRequest = {
    sourceCode: string
    sourceCodeLanguage: string
    answerCode: string
    answerCodeLanguage: string
    input: Constraint[]  
}

export type CodeTestResponse =
    {
      status: "accepted";
    }
  | {
      status: "wrong-answer";
      input: string;
      expected: string;
      actual: string;
    }
  | {
      status: "compile-error";
      target: "source" | "answer";
      stdout: string;
      stderr: string;
      exitCode: number;
    }
  | {
      status: "runtime-error";
      target: "source" | "answer";
      stdout: string;
      stderr: string;
      exitCode: number;
    };
