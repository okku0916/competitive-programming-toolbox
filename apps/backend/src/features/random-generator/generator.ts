

import type { ListConstraint, ScalarConstraint } from "@cpt/shared-types";


export function generateScalar(constraint: ScalarConstraint){

    return "3";
}

export function generateList(constraint: ListConstraint){
    return "4 3 1";

}