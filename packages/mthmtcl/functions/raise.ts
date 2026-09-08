import { Boolean, Complex, Exponentiation, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import {
  binary,
  type BinaryFn,
  type PartialBinaryFn,
  partialRight,
  when,
} from "../factories/binary.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";

export const raise: BinaryFn<Exponentiation> = binary(Exponentiation)(
  when(
    [is(Boolean), is(Boolean)],
    (l, r) => [boolean(l.raw || !r.raw), Action.Application],
  ),
  when([is(Complex), is(Complex)], (l, r) => {
    const p = Math.hypot(l.raw.a, l.raw.b),
      arg = Math.atan2(l.raw.b, l.raw.a);
    const dLnP = r.raw.b * Math.log(p), cArg = r.raw.a * arg;
    const multiplicand = (p ** r.raw.a) * Math.exp(-r.raw.b * arg);
    return [
      complex(
        multiplicand * Math.cos(dLnP + cArg),
        multiplicand * Math.sin(dLnP + cArg),
      ),
      Action.Application,
    ];
  }),
  when(
    [is(Real), is(Real)],
    (l, r) => [real(l.raw ** r.raw), Action.Application],
  ),
);

export const reciprocal: PartialBinaryFn<
  Exponentiation,
  Real
> = partialRight(raise, real(-1));

export const sqrt: PartialBinaryFn<
  Exponentiation,
  Real
> = partialRight(raise, real(0.5));

export const square: PartialBinaryFn<
  Exponentiation,
  Real
> = partialRight(raise, real(2));
