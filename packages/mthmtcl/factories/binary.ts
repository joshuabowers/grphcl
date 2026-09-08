import {
  type BinaryNode,
  Boolean,
  Complex,
  type Numeric,
  Real,
  type TreeNode,
} from "../tree/mod.ts";
import {
  type _,
  fromMulti,
  method,
  type Multi,
  multi,
} from "@arrows/multimethod";
import {
  Action,
  type Choose,
  type Constructor,
  Context,
  type EdgeCaseFn,
  is,
  type Predicate,
  type When,
} from "./factory.ts";
import { complex } from "../functions/complex.ts";
import { real } from "../functions/real.ts";

export const are = <Left, Right>(
  guardLeft: Predicate<Left>,
  guardRight: Predicate<Right>,
  inner?: (left: Left, right: Right) => boolean,
) =>
(left: unknown, right: unknown): boolean =>
  guardLeft(left) && guardRight(right) && (inner?.(left, right) ?? true);

/**
 * A unary guard, used for denoting evaluation of one branch
 * of a {@link BinaryNode}. This will either accept a
 * {@link Predicate} or the multimethod placeholder {@link _}.
 */
export type Guard<T> = Predicate<T> | typeof _;

/**
 * Describes the guard/predicate functions which can be
 * used to define an edge case. This will either be
 * a pair of {@link Guard}, flavored to the {@link Left}
 * and {@link Right}, respectively; or, it is a function
 * which accepts a {@link Predicate} for each sub-tree and
 * an optional refining guard to assert.
 *
 * Important note: due to the nature of type guards within
 * TypeScript, a function cannot assert the types of two
 * or more parameters, nor refer to rest parameters. As such,
 * this type cannot be used to influence or bias type
 * inference.
 */
export type Guards<Left, Right> =
  | [Guard<Left>, Guard<Right>]
  | ((
    guardLeft: Predicate<Left>,
    guardRight: Predicate<Right>,
    inner?: (left: Left, right: Right) => boolean,
  ) => boolean);

/**
 * Utility type to simplify the definition of {@link when}
 */
export type Rewrite<Output> = [Output, Action];

/**
 * Describes a function which takes two inputs and maps them
 * to a {@link Rewrite} pair.
 */
export type RewriteFn<Left, Right, Output = Left | Right> = (
  left: Left,
  right: Right,
) => Rewrite<Output>;

const unwrap = <Left, Right, Output = Left | Right>(
  rewrite: Rewrite<Output> | RewriteFn<Left, Right, Output>,
) =>
(left: Left, right: Right): Output =>
  (typeof rewrite === "function" ? rewrite(left, right) : rewrite)[0];

function coerce<T extends BinaryNode, R extends TreeNode | void>(
  fn: BinaryFn<T, R>,
) {
  return function <Left extends TreeNode, Right extends TreeNode>(
    leftCtor: Constructor<Left>,
    rightCtor: Constructor<Right>,
  ) {
    return function (
      changeLeft: (i: Left) => Left | Right,
      changeRight: (i: Right) => Left | Right,
    ) {
      return when(
        [is(leftCtor), is(rightCtor)],
        (l, r) => [fn(changeLeft(l), changeRight(r)), Action.Conversion],
      );
    };
  };
}

const identity = <I>(i: I) => i;

/**
 * Creates a {@link method}, providing a type-safe wrapping
 * context to simplify the construction. Used in tandem with
 * {@link binary} to define edge cases.
 * @param predicate a boolean valued guard
 * @param rewrite a rewrite rule to apply
 * @returns a contextual method, consumable by {@link binary}
 */
export function when<Left, Right, Output = Left | Right>(
  predicate: Guards<Left, Right>,
  rewrite: Rewrite<Output> | RewriteFn<Left, Right, Output>,
): When<
  Context.Algebraic
> {
  return ({
    context: Context.Algebraic,
    method: method(predicate, unwrap(rewrite)),
  });
}

/**
 * Creates a {@link method}, providing a type-safe wrapping
 * context to simplify the construction. Used in tandem with
 * {@link binary} to define an edge case of last resort.
 *
 * Unlike {@link when}, this should only be used once, as the
 * last defined edge case. By default, all {@link binary} derived
 * multimethods already have an otherwise block, which produces
 * an instance of their associated class type; this overrides
 * that method. Use with caution.
 * @param rewrite a rewrite rule to apply
 * @returns a contextual method, consumable by {@link binary}
 */
export function otherwise<
  Left extends TreeNode,
  Right extends TreeNode,
  Output = Left | Right,
>(
  rewrite: RewriteFn<Left, Right, Output>,
): When<
  Context.Otherwise
> {
  return ({
    context: Context.Otherwise,
    method: method(unwrap(rewrite)),
  });
}

/**
 * Describes a BinaryNode-flavored multimethod, with a
 * number of deterministic numerical analyses edge casee
 * which are suppored.
 *
 * Note, this list of potential inputs to return values
 * edge cases is non-exhaustive: many extra edge cases
 * have non-trivial, qualitatively non-deterministic
 * mappings. Assume, for most algebraic uses, a
 * {@link TreeNode} return value.
 *
 * A BinaryFn will normally have straight-forward mappings
 * between its numerical inputs and outputs; internally, the
 * system will coerce mixed input types into the most expansive
 * type. (I.e: Boolean => Real => Complex).
 *
 * Should a type be provided for generic type {@link R}, all
 * numerical analysis edge cases will be coerced to it.
 */
export interface BinaryFn<
  T extends BinaryNode,
  R extends TreeNode | void = void,
> extends Multi {
  (left: Boolean, right: Boolean): Choose<R, Boolean>;
  (left: Boolean, right: Complex): Choose<R, Complex>;
  (left: Boolean, right: Real): Choose<R, Real>;
  (left: Complex, right: Boolean): Choose<R, Complex>;
  (left: Complex, right: Complex): Choose<R, Complex>;
  (left: Complex, right: Real): Choose<R, Complex>;
  (left: Real, right: Boolean): Choose<R, Real>;
  (left: Real, right: Complex): Choose<R, Complex>;
  (left: Real, right: Real): Choose<R, Real>;
  (left: Numeric, right: Numeric): Choose<R, Numeric>;
  (left: TreeNode, right: TreeNode): T;
}

/**
 * A factory for creating binary mathematical functions.
 *
 * This needs to be invoked twice: the first invocation is
 * a preamable that initializes the cosntruction, collecting
 * type information for the AST type associated with the
 * produced function and an optional return type for numerical
 * analyses by that functdion.
 *
 * The second invocation is used to describe edge case analyses,
 * in which a rewrite rule is applied if the produced function
 * recieves specific inputs.
 *
 * @example
 * ```ts
 * const add = binary(Addition)(
 * // ...
 *   when(
 *     [is(Real), is(Real)],
 *     (l, r) => [
 *       real(l.raw + r.raw),
 *       Action.Application
 *     ]
 *   ),
 * // ...
 * )
 * ```
 *
 * @param ctor the constructor for a BinaryNode being created
 * @param _ctorR the constructor for a TreeNode to return
 * @returns a function for describing the edge cases of a binary function
 */
export function binary<
  T extends BinaryNode,
  R extends TreeNode | void = void,
>(
  ctor: Constructor<T>,
  _ctorR?: Constructor<R>,
): EdgeCaseFn<BinaryFn<T, R>> {
  return (...edgeCases): BinaryFn<T, R> => {
    const last = edgeCases.findLast((ec) => ec.context === Context.Otherwise) ??
      otherwise((left, right) => [new ctor(left, right), Action.Creation]);
    const fn: BinaryFn<T, R> = multi(
      ...edgeCases
        .filter((ec) => ec.context === Context.Algebraic)
        .map((ec) => ec.method),
      last.method,
    );
    return fromMulti(
      ...[
        coerce(fn)(Boolean, Real)(real, identity),
        coerce(fn)(Boolean, Complex)(complex, identity),
        coerce(fn)(Complex, Boolean)(identity, complex),
        coerce(fn)(Complex, Real)(identity, complex),
        coerce(fn)(Real, Boolean)(identity, real),
        coerce(fn)(Real, Complex)(complex, identity),
      ].map((ec) => ec.method),
    )(fn);
  };
}

/**
 * Describes derived unary functions produced by either
 * {@link partialLeft} or {@link partialRight} from a
 * supplied {@link BinaryFn}.
 *
 * A PartialBinaryFn will have the exact {@link BinaryNode}
 * return type for default-case returns as the binary function
 * from which it is derived; further, its numerical analyses
 * edge cases are constrained by the type it was partially
 * evaluated with, as denoted by {@link Bound}.
 *
 * What this means, in practice, is that Boolean edge cases
 * almost certainly disappear, and Real edge cases become
 * Complex-flavored.
 */
export interface PartialBinaryFn<
  T extends BinaryNode,
  Bound extends Numeric,
> extends Multi {
  (expression: Boolean): Bound extends Complex | Real ? Bound : Boolean;
  (expression: Complex): Complex;
  (expression: Real): Bound extends Complex ? Complex : Real;
  (expression: Numeric): Numeric;
  (expression: TreeNode): T;
}

/**
 * Creates a derived unary math function from a provided
 * binary function; the left child of all produced BinaryNodes
 * will be bound to the provided parameter. This can lead to
 * logical simplification of certain types of math expressions.
 *
 * Note that this produces a {@link PartialBinaryFn}, which
 * acts like a unary function, while the internal logic is
 * nevertheless binary.
 *
 * @example
 * ```ts
 * const double = partialLeft(multiply, real(2));
 * // ...
 * const doubled = double(variable('x'));
 * ```
 *
 * @param fn a {@link BinaryFn} to partially evaluate
 * @param left a value to associate with the left sub-tree
 * @returns a new multimethod which wraps {@link fn}
 */
export function partialLeft<
  T extends BinaryNode,
  Bound extends Numeric,
>(fn: BinaryFn<T>, left: Bound): PartialBinaryFn<T, Bound> {
  return multi(method((right: TreeNode) => fn(left, right)));
}

/**
 * Creates a derived unary math function from a provided
 * binary function; the right child of all produced BinaryNodes
 * will be bound to the provided parameter. This can lead to
 * logical simplification of certain types of math expressions.
 *
 * Note that this produces a {@link PartialBinaryFn}, which
 * acts like a unary function, while the internal logic is
 * nevertheless binary.
 *
 * @example
 * ```ts
 * const square = partialRight(raise, real(2));
 * // ...
 * const squared = square(variable('x'));
 * ```
 *
 * @param fn a {@link BinaryFn} to partially evaluate
 * @param right a value to associate with the right sub-tree
 * @returns a new multimethod which wraps {@link fn}
 */
export function partialRight<
  T extends BinaryNode,
  Bound extends Numeric,
>(fn: BinaryFn<T>, right: Bound): PartialBinaryFn<T, Bound> {
  return multi(method((left: TreeNode) => fn(left, right)));
}
