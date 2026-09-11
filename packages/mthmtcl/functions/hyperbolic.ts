import { Boolean, Complex, Hyperbolic, Numeric, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { unary, type UnaryFn, when } from "../factories/unary.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { preserve } from "./preserve.ts";
import { reciprocal } from "./raise.ts";

/**
 * Creates {@link Hyperbolic.Cosine} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = cosh(real(1)) // => real(1.5)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = cosh(complex(0, 1))
 * // ~=> complex(0.54, 0)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = cosh(variable('x'));
 * // => new Hyperbolic.Cosine(new Variable('x'))
 * ```
 */
export const cosh: UnaryFn<Hyperbolic.Cosine> = unary(
  Hyperbolic.Cosine,
)(
  when(is(Boolean), (b) => [boolean(cosh(real(b))), Action.Application]),
  when(is(Complex), (c) => [
    complex(
      Math.cosh(c.raw.a) * Math.cos(c.raw.b),
      Math.sinh(c.raw.a) * Math.sin(c.raw.b),
    ),
    Action.Application,
  ]),
  when(is(Real), (r) => [real(Math.cosh(r.raw)), Action.Application]),
);

/**
 * Creates {@link Hyperbolic.Cosecant} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = csch(real(1)) // ~=> real(0.85)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = csch(complex(0, 1))
 * // ~=> complex(0, -1.2)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = csch(variable('x'));
 * // => new Hyperbolic.Cosecant(new Variable('x'))
 * ```
 */
export const csch: UnaryFn<Hyperbolic.Cosecant> = unary(
  Hyperbolic.Cosecant,
)(
  when(
    is(Numeric),
    (n) => [preserve(n, reciprocal(sinh(n))), Action.Application],
  ),
);

/**
 * Creates {@link Hyperbolic.Cotangent} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = coth(real(1)) // ~=> real(1.3)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = coth(complex(0, 1))
 * // ~=> complex(0, -0.64)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = coth(variable('x'));
 * // => new Hyperbolic.Cotangent(new Variable('x'))
 * ```
 */
export const coth: UnaryFn<Hyperbolic.Cotangent> = unary(
  Hyperbolic.Cotangent,
)(
  when(
    is(Numeric),
    (n) => [preserve(n, reciprocal(tanh(n))), Action.Application],
  ),
);

/**
 * Creates {@link Hyperbolic.Secant} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = sech(real(1)) // => real(0.65)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = sech(complex(0, 1))
 * // ~=> complex(1.85, 0)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = sech(variable('x'));
 * // => new Hyperbolic.Secant(new Variable('x'))
 * ```
 */
export const sech: UnaryFn<Hyperbolic.Secant> = unary(
  Hyperbolic.Secant,
)(
  when(
    is(Numeric),
    (n) => [preserve(n, reciprocal(cosh(n))), Action.Application],
  ),
);

/**
 * Creates {@link Hyperbolic.Sine} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = sinh(real(1)) // => real(1.2)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = sinh(complex(0, 1))
 * // ~=> complex(0, 0.84)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = sinh(variable('x'));
 * // => new Hyperbolic.Sine(new Variable('x'))
 * ```
 */
export const sinh: UnaryFn<Hyperbolic.Sine> = unary(
  Hyperbolic.Sine,
)(
  when(is(Boolean), (b) => [boolean(sinh(real(b))), Action.Application]),
  when(is(Complex), (c) => [
    complex(
      Math.sinh(c.raw.a) * Math.cos(c.raw.b),
      Math.cosh(c.raw.a) * Math.sin(c.raw.b),
    ),
    Action.Application,
  ]),
  when(is(Real), (r) => [real(Math.sinh(r.raw)), Action.Application]),
);

/**
 * Creates {@link Hyperbolic.Tangent} AST nodes.
 *
 * This is derived from {@link unary}: it expects a single
 * expression input, and will return different TreeNode
 * outputs depending upon that input.
 *
 * @example Real input:
 * ```ts
 * const result = tanh(real(1)) // => real(0.76)
 * ```
 *
 * @example Complex input:
 * ```ts
 * const result = tanh(complex(0, 1))
 * // ~=> complex(0, 1.6)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = tanh(variable('x'));
 * // => new Hyperbolic.Tangent(new Variable('x'))
 * ```
 */
export const tanh: UnaryFn<Hyperbolic.Tangent> = unary(
  Hyperbolic.Tangent,
)(
  when(is(Boolean), (b) => [boolean(tanh(real(b))), Action.Application]),
  when(is(Complex), (c) => {
    const divisor = Math.cosh(2 * c.raw.a) + Math.cos(2 * c.raw.b);
    return [
      complex(
        Math.sinh(2 * c.raw.a) / divisor,
        Math.sin(2 * c.raw.b) / divisor,
      ),
      Action.Application,
    ];
  }),
  when(is(Real), (r) => [real(Math.tanh(r.raw)), Action.Application]),
);
