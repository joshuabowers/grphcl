import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Complex, Exponentiation, Real, Variable } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { raise, reciprocal, sqrt, square } from "./raise.ts";

describe("raise", () => {
  describe("with numeric pair inputs", () => {
    it("returns boolean for boolean input", () => {
      expect(raise(boolean(false), boolean(true))).toEqual(boolean(false));
    });

    it("returns complex for complex inputs", () => {
      expect(raise(complex(0, 1), complex(0, 1))).toEqual(
        complex(0.20787957635076193, 0),
      );
    });

    it("returns real for real inputs", () => {
      expect(raise(real(2), real(10))).toEqual(real(1024));
    });
  });

  it("generates Exponentiations for unbound input", () => {
    expect(raise(variable("x"), variable("y"))).toEqual(
      new Exponentiation(
        new Variable("x"),
        new Variable("y"),
      ),
    );
  });
});

describe("reciprocal", () => {
  it("returns real for real input", () => {
    expect(reciprocal(real(5))).toEqual(real(0.2));
  });

  it("calculates a complex reciprocal correctly", () => {
    const candidate = reciprocal(complex(1, 1));
    expect(candidate).toBeInstanceOf(Complex);
    expect(candidate.raw).toEqual({
      a: expect.closeTo(0.5, 10),
      b: expect.closeTo(-0.5, 10),
    });
  });

  it("raises unbound input to -1", () => {
    expect(reciprocal(variable("x"))).toEqual(
      new Exponentiation(
        new Variable("x"),
        new Real(-1),
      ),
    );
  });
});

describe("sqrt", () => {
  it("calculates the complex sqrt of a complex number", () => {
    expect(sqrt(complex(3, 1)).raw).toEqual({
      a: expect.closeTo(1.755317301824, 10),
      b: expect.closeTo(0.284848784593, 10),
    });
  });

  it("returns real for real input", () => {
    expect(sqrt(real(16))).toEqual(real(4));
  });

  it("raises unbound input to 0.5", () => {
    expect(sqrt(variable("x"))).toEqual(
      new Exponentiation(
        new Variable("x"),
        new Real(0.5),
      ),
    );
  });
});

describe("square", () => {
  it("calculates the proper square of a complex number", () => {
    expect(square(complex(1, 1)).raw).toEqual({
      a: expect.closeTo(0, 10),
      b: expect.closeTo(2, 10),
    });
  });

  it("returns real for real input", () => {
    expect(square(real(4))).toEqual(real(16));
  });

  it("raises unbound input to 2", () => {
    expect(square(variable("x"))).toEqual(
      new Exponentiation(
        new Variable("x"),
        new Real(2),
      ),
    );
  });
});
