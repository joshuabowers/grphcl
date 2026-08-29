import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents area hyperbolic tangents within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const atanh_x = new Tangent(x); // == atanh(x)
 * ```
 */
export class Tangent extends UnaryNode {
}
