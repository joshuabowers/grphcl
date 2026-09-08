import { Boolean, Complex, Real, Subtraction } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { binary, type BinaryFn, when } from "../factories/binary.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";

export const subtract: BinaryFn<Subtraction> = binary(Subtraction)(
  when(
    [is(Boolean), is(Boolean)],
    (l, r) => [
      boolean((l.raw || r.raw) && !(l.raw && r.raw)),
      Action.Application,
    ],
  ),
  when(
    [is(Complex), is(Complex)],
    (l, r) => [
      complex(l.raw.a - r.raw.a, l.raw.b - r.raw.b),
      Action.Application,
    ],
  ),
  when(
    [is(Real), is(Real)],
    (l, r) => [real(l.raw - r.raw), Action.Application],
  ),
);
