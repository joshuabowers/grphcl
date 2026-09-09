import { Boolean, Complex, type Numeric, Real } from "../tree/mod.ts";
import { is } from "../factories/factory.ts";
import { method, type Multi, multi } from "@arrows/multimethod";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";

export interface PreserveFn extends Multi {
  (input: Boolean, output: Numeric): Boolean;
  (input: Complex, output: Numeric): Complex;
  (input: Real, output: Numeric): Real;
  (input: Numeric, output: Numeric): Numeric;
}

export const preserve: PreserveFn = multi(
  (i: Numeric, o: Numeric) => i.constructor === o.constructor ? undefined : i,
  method(is(Boolean), (_i: Boolean, o: Numeric) => boolean(o)),
  method(is(Complex), (_i: Complex, o: Numeric) => complex(o)),
  method(is(Real), (_i: Real, o: Numeric) => real(o)),
  method((_i: Numeric, o: Numeric) => o),
);
