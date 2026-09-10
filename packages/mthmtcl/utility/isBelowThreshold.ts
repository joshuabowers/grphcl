import { method, multi } from "@arrows/multimethod";
import { is } from "../factories/factory.ts";
import { Complex, Real } from "../tree/mod.ts";
import type { ConstantPredicate } from "./integers.ts";

export const isBelowThreshold = (
  threshold: number,
): ConstantPredicate =>
  multi(
    method(is(Complex), (c: Complex) => c.raw.a < threshold),
    method(is(Real), (r: Real) => r.raw < threshold),
    method(false),
  );
