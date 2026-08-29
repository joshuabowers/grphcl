import { BinaryNode } from "./binaryNode.ts";

/**
 * Represents exponentiations within the AST.
 *
 * `left` is the base of the exponentiation; `right` is the
 * exponent to which the base is being raised.
 *
 * NB: roots, such as the square root, are represented
 * as fractional exponents: `sqrt(x) == x ** 0.5`
 *
 * @example
 * ```ts
 * const squared = new Exponentiation(
 *   new Variable('x'),
 *   new Real(2)
 * ); // == x ** 2
 * ```
 *
 * NB: exponentiation is noncommutative; in general,
 * `x ** y != y ** x`
 */
export class Exponentiation extends BinaryNode {
}
