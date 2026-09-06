import { Variable } from "../tree/mod.ts";

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
