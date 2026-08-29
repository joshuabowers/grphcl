import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents hyperbolic cosines within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const cosh_x = new Cosine(x); // == cosh(x)
 * ```
 */
export class Cosine extends UnaryNode {
}
