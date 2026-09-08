import { Multiplication, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import {
  binary,
  type BinaryFn,
  type PartialBinaryFn,
  partialLeft,
  when,
} from "../factories/binary.ts";
import { real } from "./real.ts";

export const multiply: BinaryFn<Multiplication> = binary(Multiplication)(
  when(
    [is(Real), is(Real)],
    (a, b) => [real(a.raw * b.raw), Action.Application],
  ),
);

export const double: PartialBinaryFn<Multiplication, Real> = partialLeft(
  multiply,
  real(2),
);
