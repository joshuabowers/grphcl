import { Relation } from "./relation.ts";

/**
 * Represents greater than or equals relations within the AST.
 *
 * A greater than or equalts asserts that the `left` child, when
 * ordered relative to the `right` child, comes
 * after the latter.
 *
 * @example
 * ```ts
 * const ordered = new GreaterThanOrEquals(
 *   new Variable('y'),
 *   new Variable('x')
 * ); // == [y >= x]
 * ```
 */
export class GreaterThanOrEquals extends Relation {
}
