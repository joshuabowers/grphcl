import { UnaryNode } from "./unaryNode.ts";

/**
 * Represents absolute values within the AST
 * @example
 * ```ts
 * const x = new Variable('x');
 * const abs_x = new Absolute(x); // == |x|
 * ```
 */
export class Absolute extends UnaryNode {
}
