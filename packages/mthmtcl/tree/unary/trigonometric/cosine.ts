import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents trigonometric cosines within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const cos_x = new Cosine(x); // == cos(x)
 * ```
 */
export class Cosine extends UnaryNode {
}
