import { UnaryNode } from "./unaryNode.ts";

/**
 * Represents the Gamma function (Γ) in the AST.
 *
 * The Gamma function, amongst other things, extends the
 * factorial function to nearly the full set of reals
 * and the complex numbers.
 *
 * For the integers, it generates equivalent values according
 * to the following relation: `Γ(x) == (x-1)!`
 *
 * @example
 * ```ts
 * const g = new Gamma(new Real(6)); // == 120
 * ```
 */
export class Gamma extends UnaryNode {
}
