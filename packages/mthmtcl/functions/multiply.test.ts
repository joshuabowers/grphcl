import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Multiplication, Real, Variable } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { double, multiply } from "./multiply.ts";

describe("multiply", () => {
  describe("with pairs of numeric inputs", () => {
    it("is Boolean for boolean inputs", () => {
      expect(
        multiply(boolean(true), boolean(false)),
      ).toEqual(boolean(false));
    });

    it("is Complex for complex inputs", () => {
      expect(
        multiply(complex(2, 3), complex(3, 4)),
      ).toEqual(complex(-6, 17));
    });

    it("is Real for real inputs", () => {
      expect(multiply(real(4), real(5))).toEqual(real(20));
    });
  });

  it("is a Multiplication for unbound inputs", () => {
    expect(multiply(variable("x"), variable("y"))).toEqual(
      new Multiplication(
        new Variable("x"),
        new Variable("y"),
      ),
    );
  });
});

describe("double", () => {
  it("multiplies its unbound argument by 2", () => {
    expect(double(variable("x"))).toEqual(
      new Multiplication(
        new Real(2),
        new Variable("x"),
      ),
    );
  });
});
