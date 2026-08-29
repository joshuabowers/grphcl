import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents area hyperbolic sines within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const asinh_x = new Sine(x); // == asinh(x)
 * ```
 */
export class Sine extends UnaryNode {
}
