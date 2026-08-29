import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents hyperbolic cotangents within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const coth_x = new Cotangent(x); // == coth(x)
 * ```
 */
export class Cotangent extends UnaryNode {
}
