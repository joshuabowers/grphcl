import { Absolute, Boolean, Complex, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { unary, when } from "../factories/unary.ts";

export const abs = unary(Absolute)(
  when(is(Boolean), (b) => [b, Action.Application]),
  when(
    is(Complex),
    (c) => [
      new Complex({ a: Math.hypot(c.raw.a, c.raw.b), b: 0 }),
      Action.Absorption,
    ],
  ),
  when(is(Real), (r) => [new Real(Math.abs(r.raw)), Action.Application]),
);
