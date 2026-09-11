import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Boolean, Complex, Real } from "../tree/mod.ts";
import { complex, ComplexInfinity, isComplexInfinity } from "./complex.ts";

describe("complex", () => {
  it("returns a Complex for number-pair input", () => {
    expect(complex(3, 4)).toEqual(new Complex({ a: 3, b: 4 }));
  });

  it("returns a Complex for boolean input", () => {
    expect(complex(new Boolean(true))).toEqual(new Complex({ a: 1, b: 0 }));
  });

  it("returns a Complex for Complex input", () => {
    expect(complex(new Complex({ a: 3, b: 4 }))).toEqual(
      new Complex({ a: 3, b: 4 }),
    );
  });

  it("returns a Complex for Real input", () => {
    expect(complex(new Real(5))).toEqual(new Complex({ a: 5, b: 0 }));
  });
});

describe("isComplexInfinity", () => {
  it("returns true for ComplexInfinity", () => {
    expect(isComplexInfinity(ComplexInfinity)).toBeTruthy();
  });

  it("returns true for -ComplexInfinity", () => {
    expect(isComplexInfinity(complex(-Infinity, NaN))).toBeTruthy();
  });

  it("returns false for rando complexes", () => {
    expect(isComplexInfinity(complex(-4, 3))).toBeFalsy();
  });
});
