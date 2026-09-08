import { Boolean, Complex, Multiplication, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import {
  binary,
  type BinaryFn,
  type PartialBinaryFn,
  partialLeft,
  when,
} from "../factories/binary.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";

export const multiply: BinaryFn<Multiplication> = binary(Multiplication)(
  when(
    [is(Boolean), is(Boolean)],
    (l, r) => [boolean(l.raw && r.raw), Action.Application],
  ),
  when(
    [is(Complex), is(Complex)],
    (l, r) => [
      complex(
        (l.raw.a * r.raw.a) - (l.raw.b * r.raw.b),
        (l.raw.a * r.raw.b) + (l.raw.b * r.raw.a),
      ),
      Action.Application,
    ],
  ),
  when(
    [is(Real), is(Real)],
    (l, r) => [real(l.raw * r.raw), Action.Application],
  ),
);

export const double: PartialBinaryFn<
  Multiplication,
  Real
> = partialLeft(multiply, real(2));
