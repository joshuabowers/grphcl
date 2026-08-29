import { BinaryNode } from "./binaryNode.ts";

/**
 * Represents divisions within the AST.
 *
 * NB: Division is neither commutative nor associative;
 * the order and grouping of repeated divisions matters and
 * affects the outcome of the operation.
 *
 * @example
 * ```ts
 * const divided = new Division(
 *   new Variable('x'),
 *   new Real(2)
 * ); // == x / 2
 * ```
 */
export class Division extends BinaryNode {
}
