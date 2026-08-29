import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents arcus cosecants within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const acsc_x = new Cosecant(x); // == acsc(x)
 * ```
 */
export class Cosecant extends UnaryNode {
}
