import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents trigonometric tangents within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const tan_x = new Tangent(x); // == tan(x)
 * ```
 */
export class Tangent extends UnaryNode {
}
