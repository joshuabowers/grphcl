import { UnaryNode } from "./unaryNode.ts";

/**
 * Represents logical complements in the AST
 * @example
 * ```ts
 * const x = new Variable('x');
 * const not_x = new Complement(x); // == !x
 * ```
 */
export class Complement extends UnaryNode {
}
