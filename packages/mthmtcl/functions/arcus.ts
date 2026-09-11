import { Arcus, Boolean, Complex, Numeric, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { unary, type UnaryFn, when } from "../factories/unary.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { preserve } from "./preserve.ts";
import { add } from "./add.ts";
import { subtract } from "./subtract.ts";
import { multiply } from "./multiply.ts";
import { divide } from "./divide.ts";
import { reciprocal, sqrt, square } from "./raise.ts";
import { ln } from "./log.ts";

const i = complex(0, 1);
const halfPi = real(Math.PI / 2);

/**
 * Creates {@link Arcus.Cosine} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = acos(real(1)) // => real(0)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = acos(complex(0, 1))
 * // ~=> complex(1.57, -0.88)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = acos(variable('x'));
 * // => new Arcus.Cosine(new Variable('x'))
 * ```
 */
export const acos: UnaryFn<Arcus.Cosine> = unary(
  Arcus.Cosine,
)(
  when(is(Boolean), (b) => [boolean(acos(real(b))), Action.Application]),
  when(is(Complex), (c) => [
    subtract(halfPi, asin(c)),
    Action.Application,
  ]),
  when(is(Real), (r) => [real(Math.acos(r.raw)), Action.Application]),
);

/**
 * Creates {@link Arcus.Cosecant} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = acsc(real(1)) // ~=> real(1.57)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = acsc(complex(0, 1))
 * // ~=> complex(0, -0.88)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = acsc(variable('x'));
 * // => new Arcus.Cosecant(new Variable('x'))
 * ```
 */
export const acsc: UnaryFn<Arcus.Cosecant> = unary(
  Arcus.Cosecant,
)(
  when(
    is(Numeric),
    (n) => [preserve(n, asin(reciprocal(n))), Action.Application],
  ),
);

/**
 * Creates {@link Arcus.Cotangent} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = acot(real(1)) // ~=> real(1.79)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = acot(complex(1, 1))
 * // ~=> complex(0.55, -0.40)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = acot(variable('x'));
 * // => new Arcus.Cotangent(new Variable('x'))
 * ```
 */
export const acot: UnaryFn<Arcus.Cotangent> = unary(
  Arcus.Cotangent,
)(
  when(
    is(Numeric),
    (n) => [preserve(n, subtract(halfPi, atan(n))), Action.Application],
  ),
);

/**
 * Creates {@link Arcus.Secant} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = asec(real(2)) // ~=> real(1.05)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = asec(complex(0, 1))
 * // ~=> complex(1.57, 0.88)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = asec(variable('x'));
 * // => new Arcus.Secant(new Variable('x'))
 * ```
 */
export const asec: UnaryFn<Arcus.Secant> = unary(
  Arcus.Secant,
)(
  when(
    is(Numeric),
    (n) => [preserve(n, acos(reciprocal(n))), Action.Application],
  ),
);

/**
 * Creates {@link Arcus.Sine} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = asin(real(1)) // => real(1.57)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = asin(complex(0, 1))
 * // ~=> complex(0, 0.88)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = asin(variable('x'));
 * // => new Arcus.Sine(new Variable('x'))
 * ```
 */
export const asin: UnaryFn<Arcus.Sine> = unary(
  Arcus.Sine,
)(
  when(is(Boolean), (b) => [boolean(asin(real(b))), Action.Application]),
  when(is(Complex), (c) => {
    const iz = multiply(i, c);
    const distance = sqrt(subtract(real(1), square(c)));
    return [
      multiply(i, ln(subtract(distance, iz))),
      Action.Application,
    ];
  }),
  when(is(Real), (r) => [real(Math.asin(r.raw)), Action.Application]),
);

/**
 * Creates {@link Arcus.Tangent} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = atan(real(1)) // => real(0.79)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = atan(complex(0, 1))
 * // ~=> complex(0, Infinity)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = atan(variable('x'));
 * // => new Arcus.Tangent(new Variable('x'))
 * ```
 */
export const atan: UnaryFn<Arcus.Tangent> = unary(
  Arcus.Tangent,
)(
  when(is(Boolean), (b) => [boolean(atan(real(b))), Action.Application]),
  when(is(Complex), (c) => {
    const nHalfI = complex(0, -0.5);
    const inz = subtract(i, c);
    const ipz = add(i, c);
    const ratio = divide(inz, ipz);
    return [multiply(nHalfI, ln(ratio)), Action.Application];
  }),
  when(is(Real), (r) => [real(Math.atan(r.raw)), Action.Application]),
);
