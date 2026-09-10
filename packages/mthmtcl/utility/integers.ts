import { method, type Multi, multi } from "@arrows/multimethod";
import { is } from "../factories/factory.ts";
import { Complex, type Numeric, Real } from "../tree/mod.ts";

export interface ConstantPredicate extends Multi {
  (expression: Complex): boolean;
  (expression: Real): boolean;
  (expression: Numeric): boolean;
}

type RangePredicate = (n: number) => boolean;

export const isInteger = (
  validRange?: RangePredicate,
): ConstantPredicate =>
  multi(
    method(is(Complex), (c: Complex) =>
      c.raw.b === 0 && Number.isInteger(c.raw.a) &&
      (validRange?.(c.raw.a) ?? true)),
    method(is(Real), (r: Real) =>
      Number.isInteger(r.raw) &&
      (validRange?.(r.raw) ?? true)),
    method(false),
  );

export const isNegativeInteger = isInteger((n) => n < 0);
export const isPositiveInteger = isInteger((n) => n >= 0);

export const isNonInteger: ConstantPredicate = multi(
  method(
    is(Complex),
    (c: Complex) => c.raw.b !== 0 || !Number.isInteger(c.raw.a),
  ),
  method(is(Real), (r: Real) => !Number.isInteger(r.raw)),
  method(false),
);
