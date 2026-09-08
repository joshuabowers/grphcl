import { Boolean, Complex, Numeric, Real, Trigonometric } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { unary, type UnaryFn, when } from "../factories/unary.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { reciprocal } from "./raise.ts";

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

export const csc: UnaryFn<Trigonometric.Cosecant> = unary(
  Trigonometric.Cosecant,
)(
  when(is(Numeric), (n) => [reciprocal(sin(n)), Action.Application]),
);

export const cot: UnaryFn<Trigonometric.Cotangent> = unary(
  Trigonometric.Cotangent,
)(
  when(is(Numeric), (n) => [reciprocal(tan(n)), Action.Application]),
);

export const sec: UnaryFn<Trigonometric.Secant> = unary(
  Trigonometric.Secant,
)(
  when(is(Numeric), (n) => [reciprocal(cos(n)), Action.Application]),
);

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
