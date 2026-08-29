import { Relation } from "./relation.ts";

/**
 * Represents equality relations within the AST.
 *
 * An equality asserts the two children are semantically
 * the same. This will be boolean valued, if fully
 * reducible.
 *
 * @example
 * ```ts
 * const equivalent = new Equality(
 *   new Variable('y'),
 *   new Exponentiation(
 *     new Variable('x'),
 *     new Real(2)
 *   )
 * ); // == [y == x ** 2]
 * ```
 */
export class Equality extends Relation {
}
