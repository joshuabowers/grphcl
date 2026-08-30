import { Logical } from "./logical.ts";

/**
 * Represents logical disjunctions within the AST.
 *
 * @example
 * ```ts
 * const ored = new Disjunction(
 *   new Variable('x'),
 *   new Variable('y')
 * ); // == or(x, y)
 * ```
 */
export class Disjunction extends Logical {
}
