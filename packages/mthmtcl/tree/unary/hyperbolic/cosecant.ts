import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents hyperbolic cosecants within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const csch_x = new Cosecant(x); // == csch(x)
 * ```
 */
export class Cosecant extends UnaryNode {
}
