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

/** A mapping of variable identifiers to bound values */
export type Scope = Map<string, TreeNode>;

/**
 * Creates a new {@link Scope} instance with copies of the
 * entries passed to it.
 *
 * A scope is used by the parser and the invocation logic to
 * map variable identifiers to bound values; a variable is
 * bound, with respect to a scope, iff it has a non-nil,
 * non-undefined entry within that scope.
 * @param entries the entries of a containing scope; shadowable
 * @returns a new scope built off the passed entries
 */
export const scope = (entries: Entries = []): Scope =>
  new Map<string, TreeNode>(entries);
