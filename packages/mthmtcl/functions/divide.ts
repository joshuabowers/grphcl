import { Boolean, Complex, Division, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { binary, type BinaryFn, when } from "../factories/binary.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";

export const divide: BinaryFn<Division> = binary(Division)(
  when(
    [is(Boolean), is(Boolean)],
    (l, _r) => [l, Action.Application],
  ),
  when(
    [is(Complex), is(Complex)],
    (l, r) => {
      const denominator = r.raw.a ** 2 + r.raw.b ** 2;
      const a = l.raw.a * r.raw.a + l.raw.b * r.raw.b;
      const b = l.raw.b * r.raw.a - l.raw.a * r.raw.b;
      return [
        complex(a / denominator, b / denominator),
        Action.Application,
      ];
    },
  ),
  when(
    [is(Real), is(Real)],
    (l, r) => [real(l.raw / r.raw), Action.Application],
  ),
);
