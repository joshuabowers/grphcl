import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents area hyperbolic cotangents within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const acoth_x = new Cotangent(x); // == acoth(x)
 * ```
 */
export class Cotangent extends UnaryNode {
}
