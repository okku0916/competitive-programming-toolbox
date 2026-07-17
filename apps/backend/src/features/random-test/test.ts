import type { CodeTestRequest } from "@cpt/shared-types";
import { judgeCode, manegementRandomTest } from "./service.js";

const request: CodeTestRequest = {
  sourceCode: `
#include <iostream>
using namespace std;

int main() {
    int x;
    cin >> x;
    if( x > 90){
        cout << x;
    }
    cout << x * 2 << " " << endl;
}
`,
  sourceCodeLanguage: "cpp",

  answerCode: `
#include <iostream>
using namespace std;

int main() {
    int x;
    cin >> x;
    cout << x * 2 << endl;
}
`,
  answerCodeLanguage: "cpp",

  input: [
    {
      kind: "scalar",
      typeName: "int",
      name: "x",
      min: 1,
      max: 100,
      options: [],
    },
  ],
};

const result = await manegementRandomTest(request);

console.log(result);