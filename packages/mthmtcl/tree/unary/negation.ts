import { UnaryNode } from "./unaryNode.ts";

/**
 * Represents negations within the AST.
 * @example
 * ```ts
 * const x = new Variable('x');
 * const neg_x = new Negation(x); // == -x
 * ```
 */
export class Negation extends UnaryNode {
}
