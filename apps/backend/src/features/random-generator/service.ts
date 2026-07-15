import type { Constraint } from "@cpt/shared-types";
import { generateList, generateScalar } from "./generator.js";

export function generateInput(constraints: Constraint[]): string{
    let result = "";
    for(let i = 0; i < constraints.length; i ++){
      const constraint = constraints[i];
    if (constraint.kind === "list") {
      result += generateList(constraint) + "\n";
    }
    if(constraint.kind == "scalar"){
      result += generateScalar(constraint) + "\n";
    }
  }
  return result;

}

