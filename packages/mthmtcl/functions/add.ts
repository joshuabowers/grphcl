import {
  Addition,
  Boolean,
  Complex,
  Multiplication,
  Numeric,
  Real,
  Subtraction,
  type TreeNode,
} from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { binary, type BinaryFn, rearrange, when } from "../factories/binary.ts";
import { _ } from "@arrows/multimethod";
import { boolean } from "./boolean.ts";
import { $complex } from "./complex.ts";
import { $real } from "./real.ts";
import { $double, $multiply } from "./multiply.ts";
import { $negate } from "./negate.ts";
import { deepEquals, isValue } from "../utility/deepEquals.ts";
import { grevlex } from "../utility/grevlex.ts";
import { canonicalizeFrom } from "../utility/canonicalization.ts";

/**
 * Internal implementation of {@link add}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $add: BinaryFn<Addition> = binary(Addition)(
  when(
    [is(Boolean), is(Boolean)],
    (l, r) => [
      boolean((l.raw || r.raw) && !(l.raw && r.raw)),
      Action.Application,
    ],
  ),
  when(
    [is(Complex), is(Complex)],
    (l, r) => [
      $complex(l.raw.a + r.raw.a, l.raw.b + r.raw.b),
      Action.Application,
    ],
  ),
  when(
    [is(Real), is(Real)],
    (l, r) => [$real(l.raw + r.raw), Action.Application],
  ),
  when(
    [isValue($real(0)), _],
    (_l, r) => [r, Action.Tautology],
  ),
  when(
    [_, isValue($real(0))],
    (l, _r) => [l, Action.Tautology],
  ),
  when(
    (l, r) =>
      !(l instanceof Addition) &&
      !(r instanceof Addition) &&
      grevlex(l, r) > 0,
    (l, r) => [$add(r, l), Action.Commutation],
  ),
  when(
    deepEquals,
    (l, _r) => [$double(l), Action.Idempotency],
  ),
  when<Multiplication, Multiplication>( // E.g. 2 * x + 3 * x <-> 5 * x
    (l, r) =>
      is(Multiplication)(l) && is(Numeric)(l.left) &&
      is(Multiplication)(r) && is(Numeric)(r.left) &&
      deepEquals(l.right, r.right),
    (l, r) => [
      $multiply($add(l.left, r.left), l.right),
      Action.Absorption,
    ],
  ),
  when<Multiplication, TreeNode>( // E.g. 2 * x + x <-> 3 * x
    (l, r) =>
      is(Multiplication)(l) && is(Numeric)(l.left) &&
      deepEquals(l.right, r),
    (l, r) => [
      $multiply($add(l.left, $real(1)), r),
      Action.Absorption,
    ],
  ),
  when<TreeNode, Multiplication>( // E.g. x + 2 * x <-> 3 * x
    (l, r) =>
      is(Multiplication)(r) && is(Numeric)(r.left) &&
      deepEquals(l, r.right),
    (l, r) => [
      $multiply($add(r.left, $real(1)), l),
      Action.Absorption,
    ],
  ),
  when( // NB: decanonicalization
    [is(Subtraction), _],
    (l, r) => [
      $add($add(l.left, $negate(l.right)), r),
      Action.Conversion,
    ],
  ),
  when( // NB: decanonicalization
    [_, is(Subtraction)],
    (l, r) => [
      $add(l, $add(r.left, $negate(r.right))),
      Action.Conversion,
    ],
  ),
  rearrange(Addition, () => $add, grevlex),
);

/**
 * Creates {@link Addition} AST nodes.
 *
 * Derived from {@link binary}: takes two {@link TreeNode}
 * inputs, returning some flavor of {@link TreeNode} output.
 *
 * This function performs numerous numerical and algebraic
 * analyses, yielding different types of TreeNode for
 * different edge casees. Some of these are documented by
 * the examples.
 *
 * Note that, like all {@link binary}-derived functions,
 * add will coerce mixed types (@see {@link BinaryFn}).
 *
 * @example Default algebraic analysis
 * ```ts
 * const added = add(variable('x'), variable('y'));
 * // => new Addition(new Variable('x'), new Variable('y'))
 * ```
 *
 * @example Real addition
 * ```ts
 * const result = add(real(5), real(10)) // => real(15)
 * ```
 *
 * @example Complex addition
 * ```ts
 * const result = add(complex(0, 1), complex(1, 0))
 * // => complex(1, 1)
 * ```
 *
 * @example Complex-coercion
 * ```ts
 * const result = add(real(5), complex(1, 2))
 * // => complex(6, 2)
 * ```
 */
export const add: BinaryFn<Addition> = canonicalizeFrom($add);
