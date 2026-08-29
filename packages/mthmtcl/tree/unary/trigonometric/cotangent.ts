import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents trigonometric cotangents within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const cot_x = new Cotangent(x); // == cot(x)
 * ```
 */
export class Cotangent extends UnaryNode {
}
