import { Boolean, Combination, Numeric, Permutation } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { binary, type BinaryFn, when } from "../factories/binary.ts";
import { boolean } from "./boolean.ts";
import { subtract } from "./subtract.ts";
import { multiply } from "./multiply.ts";
import { divide } from "./divide.ts";
import { factorial } from "./factorial.ts";

/**
 * Calculates the number of unique `right`-combinations of
 * `left` items, where the order of the elements in the
 * resulting sets does not matter.
 *
 * This is a {@link binary} function, and inherits that
 * factory's naming conventions. As such, while a canonical
 * expression of this function would read something like
 * `C(n, r)` or `nCr`, `combine` uses `left` and `right`.
 * So map, mentally, `n` to `left` and `r` to `right`.
 *
 * Internally, this function is implemented by {@link factorial};
 * it is related to {@link permute}.
 *
 * This function exhibits the following behavior:
 *
 * @example for boolean inputs, it is only false when
 * left is false and right is true
 * ```ts
 * const result = combine(boolean(false), boolean(true))
 * // => boolean(false)
 * // All other inputs => boolean(true)
 * ```
 *
 * @example for complex inputs
 * ```ts
 * const result = combine(complex(0, 5), complex(1, 1))
 * // ~=> complex(-1.08, 0.66)
 * ```
 *
 * @example for real inputs
 * ```ts
 * const result = combine(real(5), real(3))
 * // => real(10)
 * ```
 *
 * @example for unbound inputs, creates instances of
 * {@link Combination}.
 * ```ts
 * const result = combine(variable('n'), variable('r'))
 * // => new Combination(new Variable('n'), new Variable('r'))
 * ```
 */
export const combine: BinaryFn<Combination> = binary(Combination)(
  when([is(Boolean), is(Boolean)], (n, r) => [
    boolean(n.raw || !r.raw),
    Action.Application,
  ]),
  when([is(Numeric), is(Numeric)], (n, r) => [
    divide(
      factorial(n),
      multiply(factorial(r), factorial(subtract(n, r))),
    ),
    Action.Application,
  ]),
);

/**
 * Calculates the number of unique `right`-permutatons of
 * `left` items, where the order of the elements in the
 * resulting sets does matter.
 *
 * This is a {@link binary} function, and inherits that
 * factory's naming conventions. As such, while a canonical
 * expression of this function would read something like
 * `P(n, r)` or `nPr`, `permute` uses `left` and `right`.
 * So map, mentally, `n` to `left` and `r` to `right`.
 *
 * Internally, this function is implemented by {@link factorial};
 * it is related to {@link combine}.
 *
 * This function exhibits the following behavior:
 *
 * @example for boolean inputs, it is only false when
 * left is false and right is true
 * ```ts
 * const result = permute(boolean(false), boolean(true))
 * // => boolean(false)
 * // All other inputs => boolean(true)
 * ```
 *
 * @example for complex inputs
 * ```ts
 * const result = permute(complex(0, 5), complex(1, 1))
 * // ~=> complex(-0.93, 0.06)
 * ```
 *
 * @example for real inputs
 * ```ts
 * const result = permute(real(5), real(3))
 * // => real(60)
 * ```
 *
 * @example for unbound inputs, creates instances of
 * {@link Permutation}.
 * ```ts
 * const result = permute(variable('n'), variable('r'))
 * // => new Permutaton(new Variable('n'), new Variable('r'))
 * ```
 */
export const permute: BinaryFn<Permutation> = binary(Permutation)(
  when([is(Boolean), is(Boolean)], (n, r) => [
    boolean(n.raw || !r.raw),
    Action.Application,
  ]),
  when([is(Numeric), is(Numeric)], (n, r) => [
    divide(
      factorial(n),
      factorial(subtract(n, r)),
    ),
    Action.Application,
  ]),
);
