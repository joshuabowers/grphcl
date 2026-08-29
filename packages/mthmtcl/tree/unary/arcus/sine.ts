import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents arcus sines within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const asin_x = new Sine(x); // == asin(x)
 * ```
 */
export class Sine extends UnaryNode {
}
