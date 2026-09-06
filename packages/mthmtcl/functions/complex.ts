import { Boolean, Complex, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { field, when } from "../factories/field.ts";

export const complex = field(
  Complex,
  ([a, b]: [number, number]) => ({ a, b }),
)(
  when(is(Boolean), (b) => [[b.raw ? 1 : 0, 0], Action.Conversion]),
  when(is(Complex), (c) => [[c.raw.a, c.raw.b], Action.Identity]),
  when(is(Real), (r) => [[r.raw, 0], Action.Conversion]),
);
