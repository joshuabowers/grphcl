import { Addition, Boolean, Complex, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { binary, type BinaryFn, when } from "../factories/binary.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";

export const add: BinaryFn<Addition> = binary(Addition)(
  when(
    [is(Boolean), is(Boolean)],
    (a, b) => [
      boolean((a.raw || b.raw) && !(a.raw && b.raw)),
      Action.Application,
    ],
  ),
  when(
    [is(Complex), is(Complex)],
    (a, b) => [
      complex(a.raw.a + b.raw.a, a.raw.b + b.raw.b),
      Action.Application,
    ],
  ),
  when(
    [is(Real), is(Real)],
    (a, b) => [real(a.raw + b.raw), Action.Application],
  ),
);
