import { type TreeNode, Variable } from "../tree/mod.ts";

/**
 * A thin-wrapper around the {@link Variable} constructor,
 * designed for internal library consistency.
 *
 * @example
 * ```ts
 * const x = variable('x'); // => new Variable('x')
 * ```
 * @param name the identifier of the variable
 * @returns a new {@link Variable} instance
 */
export function variable(name: string): Variable {
  return new Variable(name);
}

type Entries = Iterable<readonly [string, TreeNode]>;
export type Scope = Map<string, TreeNode>;

export const scope = (entries: Entries = []): Scope =>
  new Map<string, TreeNode>(entries);
