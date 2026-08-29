import { UnaryNode } from "../unaryNode.ts";

/**
 * Represents arcus cosines within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const acos_x = new Cosine(x); // == acos(x)
 * ```
 */
export class Cosine extends UnaryNode {
}
