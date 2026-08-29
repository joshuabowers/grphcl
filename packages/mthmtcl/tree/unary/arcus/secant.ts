import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents arcus secants within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const asec_x = new Secant(x); // == asec(x)
 * ```
 */
export class Secant extends UnaryNode {
}
