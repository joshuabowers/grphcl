import { Boolean, Complex, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { field, when } from "../factories/field.ts";

export const real = field(Real, ([n]: [number]) => n)(
  when(is(Boolean), (b) => [[b.raw ? 1 : 0], Action.Conversion]),
  when(is(Complex), (c) => [[c.raw.a], Action.Conversion]),
  when(is(Real), (r) => [[r.raw], Action.Identity]),
);

export const EulerMascheroni = real(0.57721566490153286060);
