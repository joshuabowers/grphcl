import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents arcus tangents within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const atan_x = new Tangent(x); // == atan(x)
 * ```
 */
export class Tangent extends UnaryNode {
}
