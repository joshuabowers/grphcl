import {
  AreaHyperbolic,
  Boolean,
  Complex,
  Numeric,
  Real,
} from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { unary, type UnaryFn, when } from "../factories/unary.ts";
import { boolean } from "./boolean.ts";
import { real } from "./real.ts";
import { preserve } from "./preserve.ts";
import { add } from "./add.ts";
import { subtract } from "./subtract.ts";
import { multiply } from "./multiply.ts";
import { divide } from "./divide.ts";
import { reciprocal, sqrt, square } from "./raise.ts";
import { ln } from "./log.ts";

/**
 * Creates {@link AreaHyperbolic.Cosine} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = acosh(real(1)) // => real(0)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = acosh(complex(2, 1))
 * // ~=> complex(1.47, 0.507)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = acosh(variable('x'));
 * // => new AreaHyperbolic.Cosine(new Variable('x'))
 * ```
 */
export const acosh: UnaryFn<AreaHyperbolic.Cosine> = unary(
  AreaHyperbolic.Cosine,
)(
  when(is(Boolean), (b) => [boolean(acosh(real(b))), Action.Application]),
  when(is(Complex), (c) => [
    ln(add(
      c,
      multiply(
        sqrt(add(c, real(1))),
        sqrt(subtract(c, real(1))),
      ),
    )),
    Action.Application,
  ]),
  when(is(Real), (r) => [real(Math.acosh(r.raw)), Action.Application]),
);

/**
 * Creates {@link AreaHyperbolic.Cosecant} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = acsch(real(1)) // ~=> real(0.881)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = acsch(complex(0, 1))
 * // ~=> complex(0, -1.57)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = acsch(variable('x'));
 * // => new AreaHyperbolic.Cosecant(new Variable('x'))
 * ```
 */
export const acsch: UnaryFn<AreaHyperbolic.Cosecant> = unary(
  AreaHyperbolic.Cosecant,
)(
  when(
    is(Numeric),
    (n) => [preserve(n, asinh(reciprocal(n))), Action.Application],
  ),
);

/**
 * Creates {@link AreaHyperbolic.Cotangent} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = acoth(real(1)) // ~=> real(Infinity)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = acoth(complex(0, 1))
 * // ~=> complex(0, -0.785)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = acoth(variable('x'));
 * // => new AreaHyperbolic.Cotangent(new Variable('x'))
 * ```
 */
export const acoth: UnaryFn<AreaHyperbolic.Cotangent> = unary(
  AreaHyperbolic.Cotangent,
)(
  when(
    is(Numeric),
    (n) => [preserve(n, atanh(reciprocal(n))), Action.Application],
  ),
);

/**
 * Creates {@link AreaHyperbolic.Secant} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = asech(real(0.5)) // => real(1.32)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = asech(complex(0, 1))
 * // ~=> complex(0.881, -1.57)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = asech(variable('x'));
 * // => new AreaHyperbolic.Secant(new Variable('x'))
 * ```
 */
export const asech: UnaryFn<AreaHyperbolic.Secant> = unary(
  AreaHyperbolic.Secant,
)(
  when(
    is(Numeric),
    (n) => [preserve(n, acosh(reciprocal(n))), Action.Application],
  ),
);

/**
 * Creates {@link AreaHyperbolic.Sine} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = asinh(real(1)) // => real(0.881)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = asinh(complex(0, 1))
 * // ~=> complex(0, 1.57)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = asinh(variable('x'));
 * // => new AreaHyperbolic.Sine(new Variable('x'))
 * ```
 */
export const asinh: UnaryFn<AreaHyperbolic.Sine> = unary(
  AreaHyperbolic.Sine,
)(
  when(is(Boolean), (b) => [boolean(asinh(real(b))), Action.Application]),
  when(is(Complex), (c) => [
    ln(add(
      sqrt(add(square(c), real(1))),
      c,
    )),
    Action.Application,
  ]),
  when(is(Real), (r) => [real(Math.asinh(r.raw)), Action.Application]),
);

/**
 * Creates {@link AreaHyperbolic.Tangent} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = atanh(real(1)) // => real(Infinity)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = atanh(complex(0, 1))
 * // ~=> complex(0, 0.785)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = atanh(variable('x'));
 * // => new AreaHyperbolic.Tangent(new Variable('x'))
 * ```
 */
export const atanh: UnaryFn<AreaHyperbolic.Tangent> = unary(
  AreaHyperbolic.Tangent,
)(
  when(is(Boolean), (b) => [boolean(atanh(real(b))), Action.Application]),
  when(is(Complex), (c) => [
    multiply(
      real(0.5),
      ln(divide(
        add(real(1), c),
        subtract(real(1), c),
      )),
    ),
    Action.Application,
  ]),
  when(is(Real), (r) => [real(Math.atanh(r.raw)), Action.Application]),
);
