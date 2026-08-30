import { Logical } from "./logical.ts";

/**
 * Represents logical implications within the AST.
 *
 * @example
 * ```ts
 * const anded = new Implication(
 *   new Variable('x'),
 *   new Variable('y')
 * ); // == implies(x, y)
 * ```
 */
export class Implication extends Logical {
}
