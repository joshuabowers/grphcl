import { Boolean, Complex, Numeric, Real, Trigonometric } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { unary, type UnaryFn, when } from "../factories/unary.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { preserve } from "./preserve.ts";
import { reciprocal } from "./raise.ts";

/**
 * Creates {@link Trigonometric.Cosine} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = cos(real(Math.PI)) // => real(-1)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = cos(complex(1, 2))
 * // ~=> complex(2.03, -3.05)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = cos(variable('x'));
 * // => new Cosine(new Variable('x'))
 * ```
 */
export const cos: UnaryFn<Trigonometric.Cosine> = unary(
  Trigonometric.Cosine,
)(
  when(is(Boolean), (b) => [boolean(cos(real(b))), Action.Application]),
  when(is(Complex), (c) => [
    complex(
      Math.cos(c.raw.a) * Math.cosh(c.raw.b),
      -Math.sin(c.raw.a) * Math.sinh(c.raw.b),
    ),
    Action.Application,
  ]),
  when(is(Real), (r) => [real(Math.cos(r.raw)), Action.Application]),
);

/**
 * Creates {@link Trigonometric.Cosecant} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = csc(real(0.5)) // ~=> real(2.09)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = csc(complex(1, 2))
 * // ~=> complex(0.23, -0.14)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = csc(variable('x'));
 * // => new Cosecant(new Variable('x'))
 * ```
 */
export const csc: UnaryFn<Trigonometric.Cosecant> = unary(
  Trigonometric.Cosecant,
)(
  when(
    is(Numeric),
    (n) => [preserve(n, reciprocal(sin(n))), Action.Application],
  ),
);

/**
 * Creates {@link Trigonometric.Cotangent} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = cot(real(0.5)) // ~=> real(1.83)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = cot(complex(1, 2))
 * // ~=> complex(0.03, -0.98)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = cot(variable('x'));
 * // => new Cotangent(new Variable('x'))
 * ```
 */
export const cot: UnaryFn<Trigonometric.Cotangent> = unary(
  Trigonometric.Cotangent,
)(
  when(
    is(Numeric),
    (n) => [preserve(n, reciprocal(tan(n))), Action.Application],
  ),
);

/**
 * Creates {@link Trigonometric.Secant} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = sec(real(0.5)) // => real(1.14)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = sec(complex(1, 2))
 * // ~=> complex(0.15, 0.23)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = sec(variable('x'));
 * // => new Secant(new Variable('x'))
 * ```
 */
export const sec: UnaryFn<Trigonometric.Secant> = unary(
  Trigonometric.Secant,
)(
  when(
    is(Numeric),
    (n) => [preserve(n, reciprocal(cos(n))), Action.Application],
  ),
);

/**
 * Creates {@link Trigonometric.Sine} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = sin(real(Math.PI)) // => real(0)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = sin(complex(1, 2))
 * // ~=> complex(3.17, 1.96)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = sin(variable('x'));
 * // => new Sine(new Variable('x'))
 * ```
 */
export const sin: UnaryFn<Trigonometric.Sine> = unary(
  Trigonometric.Sine,
)(
  when(is(Boolean), (b) => [boolean(sin(real(b))), Action.Application]),
  when(is(Complex), (c) => [
    complex(
      Math.sin(c.raw.a) * Math.cosh(c.raw.b),
      Math.cos(c.raw.a) * Math.sinh(c.raw.b),
    ),
    Action.Application,
  ]),
  when(is(Real), (r) => [real(Math.sin(r.raw)), Action.Application]),
);

/**
 * Creates {@link Trigonometric.Tangent} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = tan(real(0.5)) // => real(0.55)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = tan(complex(1, 2))
 * // ~=> complex(0.03, 1.01)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = tan(variable('x'));
 * // => new Tangent(new Variable('x'))
 * ```
 */
export const tan: UnaryFn<Trigonometric.Tangent> = unary(
  Trigonometric.Tangent,
)(
  when(is(Boolean), (b) => [boolean(tan(real(b))), Action.Application]),
  when(is(Complex), (c) => {
    const divisor = Math.cos(2 * c.raw.a) + Math.cosh(2 * c.raw.b);
    return [
      complex(
        Math.sin(2 * c.raw.a) / divisor,
        Math.sinh(2 * c.raw.b) / divisor,
      ),
      Action.Application,
    ];
  }),
  when(is(Real), (r) => [real(Math.tan(r.raw)), Action.Application]),
);
