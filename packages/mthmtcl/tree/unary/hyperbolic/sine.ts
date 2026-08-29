import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents hyperbolic sines within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const sinh_x = new Sine(x); // == sinh(x)
 * ```
 */
export class Sine extends UnaryNode {
}
