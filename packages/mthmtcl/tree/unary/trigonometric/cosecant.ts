import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents trigonometric cosecants within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const csc_x = new Cosecant(x); // == csc(x)
 * ```
 */
export class Cosecant extends UnaryNode {
}
