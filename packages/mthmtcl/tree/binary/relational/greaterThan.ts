import { Relation } from "./relation.ts";

/**
 * Represents greater than relations within the AST.
 *
 * A greater than asserts that the `left` child, when
 * ordered relative to the `right` child, strictly comes
 * after the latter.
 *
 * @example
 * ```ts
 * const ordered = new GreaterThan(
 *   new Variable('y'),
 *   new Variable('x')
 * ); // == [y > x]
 * ```
 */
export class GreaterThan extends Relation {
}
