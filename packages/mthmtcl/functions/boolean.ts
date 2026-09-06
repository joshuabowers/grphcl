import { Boolean, Complex, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { field, when } from "../factories/field.ts";

export const boolean = field(Boolean, ([b]: [boolean]) => b)(
  when(is(Boolean), (b) => [[b.raw], Action.Identity]),
  when(
    is(Complex),
    (c) => [[c.raw.a !== 0 && c.raw.b !== 0], Action.Conversion],
  ),
  when(is(Real), (r) => [[r.raw !== 0], Action.Conversion]),
);
