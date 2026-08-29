import { BinaryNode } from "./binaryNode.ts";

/**
 * Represents a multiplication within the AST.
 *
 * NB: multiplication is both commutative and associative; the
 * multiplicands can be repositioned and regrouped without
 * affecting the result of the nested operations.
 *
 * mthmtcl will attempt to use this to syntactically reduce
 * nested multiplications.
 *
 * @example
 * ```ts
 * const multiplied = new Multiplication(
 *   new Real(2),
 *   new Variable('x')
 * ); // == 2 * x
 * ```
 */
export class Multiplication extends BinaryNode {
}
