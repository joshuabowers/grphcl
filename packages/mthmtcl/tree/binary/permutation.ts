import { BinaryNode } from "./binaryNode.ts";

/**
 * Represents a combinatoric permutation within the AST.
 *
 * A `P(n, k)` permutation counts the unique `k`-sized
 * permuations of `n` items, `k <= n`, where the order of the
 * items within the permutation is relevant.
 *
 * Related to {@link Combination}; generally, `P(n, k) > C(n, k)`
 * @example
 * ```ts
 * const permuations = new Permutation(
 *   new Real(3),
 *   new Real(2)
 * ); // == 6
 * ```
 */
export class Permuation extends BinaryNode {
}
