import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents hyperbolic secants within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const sech_x = new Secant(x); // == sech(x)
 * ```
 */
export class Secant extends UnaryNode {
}
