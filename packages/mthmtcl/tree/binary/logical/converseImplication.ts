import { Logical } from "./logical.ts";

/**
 * Represents logical converse implications within the AST.
 *
 * @example
 * ```ts
 * const anded = new ConverseImplication(
 *   new Variable('x'),
 *   new Variable('y')
 * ); // == converse(x, y)
 * ```
 */
export class ConverseImplication extends Logical {
}
