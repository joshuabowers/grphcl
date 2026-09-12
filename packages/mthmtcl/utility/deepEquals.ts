import {
  BinaryNode,
  Boolean,
  Complex,
  type Numeric,
  Real,
  type TreeNode,
  UnaryNode,
  Variable,
} from "../tree/mod.ts";
import type { Constructor } from "../factories/factory.ts";
import { method, type Multi, multi } from "@arrows/multimethod";

type EvaluationFn<T extends TreeNode> =
  | ((left: T, right: T) => boolean)
  | boolean;

const when = <T extends TreeNode>(
  ctor: Constructor<T>,
  evaluate: EvaluationFn<T>,
) =>
  method(
    (left: T, right: T) =>
      left instanceof ctor && right instanceof ctor &&
      left.constructor === right.constructor,
    evaluate,
  );

export interface DeepEqualsFn extends Multi {
  (left: Boolean, right: Boolean): boolean;
  (left: Complex, right: Complex): boolean;
  (left: Real, right: Real): boolean;
  (left: Numeric, right: Numeric): boolean;
  (left: Variable, right: Variable): boolean;
  (left: UnaryNode, right: UnaryNode): boolean;
  (left: BinaryNode, right: BinaryNode): boolean;
  (left: TreeNode, right: TreeNode): boolean;
}

/**
 * Deeply compares two {@link TreeNode} trees, returning
 * their semantic equality.
 *
 * This will recursively walk branches until a failure along
 * the branch; this can result in an O(n) compute time.
 * Beware for large trees!
 *
 * @example
 * ```ts
 * const a = real(5), b = complex(1, 1);
 * const result = deepEquals(a, b) // => false
 * ```
 */
export const deepEquals: DeepEqualsFn = multi(
  when(Boolean, (l, r) => l.raw === r.raw),
  when(
    Complex,
    (l, r) => l.raw.a === r.raw.a && l.raw.b === r.raw.b,
  ),
  when(Real, (l, r) => l.raw === r.raw),
  when(Variable, (l, r) => l.name === r.name),
  when(UnaryNode, (l, r) => deepEquals(l.child, r.child)),
  when(
    BinaryNode,
    (l, r) => deepEquals(l.left, r.left) && deepEquals(l.right, r.right),
  ),
  method(false),
);

/**
 * Creates a predicate which uses {@link deepEquals} to
 * compare an {@link expected} value against the value
 * passed to the predicate.
 *
 * @example
 * ```ts
 * const tree = parse('x ** 2');
 * if(isValue(square(variable('x')))(tree)) {
 *   // => tree is an Exponentiation...
 * }
 *
 * ```
 * @param expected a value to test for
 * @returns a fucntion which compares against expected
 */
export const isValue =
  <T extends TreeNode>(expected: T) => (actual: unknown): actual is T => (
    actual instanceof expected.constructor &&
    deepEquals(expected, actual)
  );
