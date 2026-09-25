import type { TreeNode } from "../tree/mod.ts";
import { invoke } from "../functions/invocation.ts";
import { type Scope, scope as createScope } from "@bowers/mthmtcl/functions";
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
