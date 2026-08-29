import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents hyperbolic tangents within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const tanh_x = new Tangent(x); // == tanh(x)
 * ```
 */
export class Tangent extends UnaryNode {
}
