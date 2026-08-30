import { Logical } from "./logical.ts";

/**
 * Represents logical biconditionals within the AST.
 *
 * @example
 * ```ts
 * const anded = new Biconditional(
 *   new Variable('x'),
 *   new Variable('y')
 * ); // == xnor(x, y)
 * ```
 */
export class Biconditional extends Logical {
}
