import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents area hyperbolic cosines within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const acosh_x = new Cosine(x); // == acosh(x)
 * ```
 */
export class Cosine extends UnaryNode {
}
