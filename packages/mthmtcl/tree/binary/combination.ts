import { BinaryNode } from "./binaryNode.ts";

/**
 * Represents a combinatoric combination within the AST.
 *
 * A `C(n, k)` combination counts the unique `k` sized
 * permutations of `n` items, `k <= n`, without respect to the
 * order of the items within the permutations.
 *
 * Related to {@link Permuation}; generally, `C(n, k) < P(n, k)`
 * @example
 * ```ts
 * const combinations = new Combination(
 *   new Real(3),
 *   new Real(2)
 * ); // == 3
 * ```
 */
export class Combination extends BinaryNode {
}
