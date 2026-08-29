import { Relation } from "./relation.ts";

/**
 * Represents less than or equals relations within the AST.
 *
 * A less than or equals asserts that the `left` child, when
 * ordered relative to the `right` child, comes
 * before the latter.
 *
 * @example
 * ```ts
 * const ordered = new LessThanOrEquals(
 *   new Variable('y'),
 *   new Variable('x')
 * ); // == [y <= x]
 * ```
 */
export class LessThanOrEquals extends Relation {
}
