import { BinaryNode } from "./binaryNode.ts";

/**
 * Represents additions within the AST.
 *
 * NB: addition is both commutative and associative; the
 * addends can be repositioned and regrouped without
 * affecting the result of the nested operations.
 *
 * mthmtcl will attempt to use this to syntactically reduce
 * nested additions.
 *
 * @example
 * ```ts
 * const added = new Addition(
 *   new Variable('x'),
 *   new Real(1)
 * ); // == x + 1
 * ```
 */
export class Addition extends BinaryNode {
}
