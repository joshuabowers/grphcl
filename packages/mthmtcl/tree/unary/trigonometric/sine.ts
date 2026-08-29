import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents trigonometric sines within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const sin_x = new Sine(x); // == sin(x)
 * ```
 */
export class Sine extends UnaryNode {
}
