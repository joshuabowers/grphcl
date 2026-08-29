import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents arcus cotangents within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const acot_x = new Cotangent(x); // == acot(x)
 * ```
 */
export class Cotangent extends UnaryNode {
}
