import { Logical } from "./logical.ts";

/**
 * Represents logical conjunctions within the AST.
 *
 * @example
 * ```ts
 * const anded = new Conjunction(
 *   new Variable('x'),
 *   new Variable('y')
 * ); // == and(x, y)
 * ```
 */
export class Conjunction extends Logical {
}
