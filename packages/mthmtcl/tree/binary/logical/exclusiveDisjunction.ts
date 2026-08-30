import { Logical } from "./logical.ts";

/**
 * Represents logical exlusive disjunctions within the AST.
 *
 * @example
 * ```ts
 * const anded = new ExclusiveDisjunction(
 *   new Variable('x'),
 *   new Variable('y')
 * ); // == xor(x, y)
 * ```
 */
export class ExclusiveDisjunction extends Logical {
}
