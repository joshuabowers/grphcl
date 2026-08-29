import { Relation } from "./relation.ts";

/**
 * Represents inequality relations within the AST.
 *
 * An inequality asserts its two children are semantically
 * different.
 *
 * @example
 * ```ts
 * const inequivalent = new Inequality(
 *   new Variable('y'),
 *   new Addition(
 *     new Variable('x'),
 *     new Real(5)
 *   )
 * ); // == [y != x + 5]
 * ```
 */
export class Inequality extends Relation {
}
