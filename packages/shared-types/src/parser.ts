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

