import { BinaryNode } from "./binaryNode.ts";

/**
 * Represents the polygamma (ψ) function within the AST.
 *
 * The polygamma functions are related to the {@link Gamma}
 * function: specifically, they describe successive derivatives
 * of Gamma and each other. Polygamma 0 (`ψ(0)`) is digamma, the
 * first derivative of Gamma; each integer increase thereafter
 * is the next order derivative.
 *
 * NB: `left` describes the derivative to calculate, and should
 * only be used with integer values; `right` is the expression
 * that the function is being evaluated on.
 *
 * @example
 * ```ts
 * const digamma = new Polygamma(
 *   new Real(0),
 *   new Variable('x')
 * ); // == ψ(0, x)
 * ```
 */
export class Polygamma extends BinaryNode {
}
