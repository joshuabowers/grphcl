import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Absolute, Boolean, Complex, Real, Variable } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { abs } from "./absolute.ts";

describe("abs", () => {
  it("returns an Absolute for unbound input", () => {
    expect(abs(variable("x"))).toBeInstanceOf(Absolute);
    expect(abs(variable("x"))).toEqual(new Absolute(new Variable("x")));
  });

  it("returns a Boolean for Boolean input", () => {
    expect(abs(boolean(true))).toBeInstanceOf(Boolean);
    expect(abs(boolean(true))).toEqual(new Boolean(true));
  });

  it("returns a Complex for Complex input", () => {
    expect(abs(complex(0, 1))).toBeInstanceOf(Complex);
    expect(abs(complex(0, 1))).toEqual(new Complex({ a: 1, b: 0 }));
  });

  it("returns a Real for Real input", () => {
    expect(abs(real(5))).toBeInstanceOf(Real);
    expect(abs(real(5))).toEqual(new Real(5));
  });

  it("negates real values less than 0", () => {
    expect(abs(real(-5))).toEqual(real(5));
  });

  it("calculates the magnitude of complex values", () => {
    expect(abs(complex(3, 4))).toEqual(complex(5, 0));
  });
});
