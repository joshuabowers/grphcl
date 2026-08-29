import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents area hyperbolic cosecants within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const acsch_x = new Cosecant(x); // == acsch(x)
 * ```
 */
export class Cosecant extends UnaryNode {
}
