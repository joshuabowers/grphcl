import { UnaryNode } from "./unaryNode.ts";

/**
 * Represents the polynomial degree of an expression in the AST
 * @example
 * ```ts
 * const x = new Variable('x');
 * const x_squared = new Exponentiation(x, new Real(2));
 * const d = new Degree(x_squared); // == 2
 * ```
 */
export class Degree extends UnaryNode {
}
