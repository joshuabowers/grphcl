import { Relation } from "./relation.ts";

/**
 * Represents less than relations within the AST.
 *
 * A less than asserts that the `left` child, when
 * ordered relative to the `right` child, strictly comes
 * before the latter.
 *
 * @example
 * ```ts
 * const ordered = new LessThan(
 *   new Variable('y'),
 *   new Variable('x')
 * ); // == [y < x]
 * ```
 */
export class LessThan extends Relation {
}
