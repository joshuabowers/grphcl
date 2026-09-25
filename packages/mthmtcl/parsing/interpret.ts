import type { TreeNode } from "../tree/mod.ts";
import { invoke, type Scope, scope as createScope } from "../functions/mod.ts";
import { parser } from "./parser.ts";

export interface Parsing {
  source: string;
  input: TreeNode;
  output: TreeNode;
}

export function interpret(
  source: string,
  scope: Scope = createScope(),
): Parsing {
  const input = parser.value(source, { context: scope });
  const output = invoke(scope)(input)();
  return ({ source, input, output });
}
