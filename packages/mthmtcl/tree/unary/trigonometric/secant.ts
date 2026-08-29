import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents trigonometric secants within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const sec_x = new Secant(x); // == sec(x)
 * ```
 */
export class Secant extends UnaryNode {
}
