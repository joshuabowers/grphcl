import { BinaryNode } from "./binaryNode.ts";

/**
 * Represents a logarithm within the AST.
 *
 * A logarithm produces the exponent a given base would need
 * to be raised to to produce the supplied value. I.e.: if
 * `log(b, x) == n`, then `b ** n == x` would also be true.
 *
 * NB: `left` is the base of the logarithm; `right` is the value.
 *
 * @example
 * ```ts
 * const l = new Logarithm(
 *   new Real(2),
 *   new Variable('x')
 * ); // == log(2, x)
 * ```
 */
export class Logarithm extends BinaryNode {
}
