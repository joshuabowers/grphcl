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

export type Guard<T> = Predicate<T> | typeof _;

export type Guards<Left, Right> =
  | [Guard<Left>, Guard<Right>]
  | ((
    guardLeft: Predicate<Left>,
    guardRight: Predicate<Right>,
    inner?: (left: Left, right: Right) => boolean,
  ) => boolean);

export type Rewrite<Output> = [Output, Action];

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

export function partialLeft<
  T extends BinaryNode,
  Bound extends Numeric,
>(fn: BinaryFn<T>, left: Bound): PartialBinaryFn<T, Bound> {
  return multi(method((right: TreeNode) => fn(left, right)));
}

export function partialRight<
  T extends BinaryNode,
  Bound extends Numeric,
>(fn: BinaryFn<T>, right: Bound): PartialBinaryFn<T, Bound> {
  return multi(method((left: TreeNode) => fn(left, right)));
}
