import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents area hyperbolic secants within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const asech_x = new Secant(x); // == asech(x)
 * ```
 */
export class Secant extends UnaryNode {
}
