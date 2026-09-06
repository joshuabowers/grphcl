import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Negation, Variable } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { negate } from "./negate.ts";

describe("negate", () => {
  it("does not alter a boolean input", () => {
    expect(negate(boolean(true))).toEqual(boolean(true));
    expect(negate(boolean(false))).toEqual(boolean(false));
  });

  it("flips the sign of both components of a complex number", () => {
    expect(negate(complex(3, -4))).toEqual(complex(-3, 4));
  });

  it("flips the sign of a Real input", () => {
    expect(negate(real(5))).toEqual(real(-5));
  });

  it("returns a Negation for unbound input", () => {
    expect(negate(variable("x"))).toEqual(new Negation(new Variable("x")));
  });
});
