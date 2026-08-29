import { BinaryNode } from "./binaryNode.ts";

/**
 * Represents exponentiations within the AST.
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
