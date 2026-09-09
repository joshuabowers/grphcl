import { Boolean, Complex, Logarithm, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import {
  binary,
  type BinaryFn,
  type PartialBinaryFn,
  partialLeft,
  when,
} from "../factories/binary.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { divide } from "./divide.ts";

const lnComplex = (c: Complex) =>
  complex(
    Math.log(Math.hypot(c.raw.a, c.raw.b)),
    Math.atan2(c.raw.b, c.raw.a),
  );

/**
 * Creates instances of {@link Logarithm} AST nodes.
 *
 * This function is derived from {@link binary}. Due to
 * language limitations, it---and Logarithm---inherit the
 * naming conventions used by binary. As such, be aware that
 * `log` treats the first parameter, `left` as the base of
 * the logarithm being constructed, while the second parameter,
 * `right` is interpreted as the input value to that based-log.
 *
 * @example Real inputs
 * ```ts
 * const result = log(real(2), real(1024)) // => real(10)
 * ```
 *
 * @example Complex inputs
 * ```ts
 * const result = log(complex(0, 1), complex(1, 2))
 * // ~=> complex(0.705, -0.512)
 * ```
 *
 * @example Unbound inputs
 * ```ts
 * const result = log(variable('b'), variable('x'))
 * // => new Logarithm(new Variable('b'), new Variable('x'))
 * ```
 */
export const log: BinaryFn<Logarithm> = binary(Logarithm)(
  // This implementation for booleans is hacky.
  when([is(Boolean), is(Boolean)], (l, r) => [
    boolean(log(real(l), real(r))),
    Action.Application,
  ]),
  when([is(Complex), is(Complex)], (l, r) => [
    divide(lnComplex(r), lnComplex(l)),
    Action.Application,
  ]),
  when([is(Real), is(Real)], (l, r) => [
    real(Math.log(r.raw) / Math.log(l.raw)),
    Action.Application,
  ]),
);

/**
 * Creates instances of {@link Logarithm} with a preset
 * base of 2.
 *
 * This is a {@link PartialBinaryFn}: it will behave like
 * a unary function, but operates on a {@link BinaryNode}.
 * Like other partial functions, this has more aggressive
 * type coercion, so be wary.
 */
export const lb: PartialBinaryFn<
  Logarithm,
  Real
> = partialLeft(log, real(2));

/**
 * Creates instances of {@link Logarithm} with a preset
 * base of 10.
 *
 * This is a {@link PartialBinaryFn}: it will behave like
 * a unary function, but operates on a {@link BinaryNode}.
 * Like other partial functions, this has more aggressive
 * type coercion, so be wary.
 */
export const lg: PartialBinaryFn<
  Logarithm,
  Real
> = partialLeft(log, real(10));

/**
 * Creates instances of {@link Logarithm} with a preset
 * base of `e`.
 *
 * This is a {@link PartialBinaryFn}: it will behave like
 * a unary function, but operates on a {@link BinaryNode}.
 * Like other partial functions, this has more aggressive
 * type coercion, so be wary.
 */
export const ln: PartialBinaryFn<
  Logarithm,
  Real
> = partialLeft(log, real(Math.E));
