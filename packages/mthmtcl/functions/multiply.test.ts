import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Multiplication, Real, Variable } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex, ComplexInfinity } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { negate } from "./negate.ts";
import { double, multiply } from "./multiply.ts";
import { square } from "./raise.ts";

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

    it("handles -complex * -ComplexInfinity", () => {
      expect(
        multiply(complex(0, -0.5), negate(ComplexInfinity)),
      ).toEqual(ComplexInfinity);
    });

    it("handles [0 - 0.5i] * [-Infinity + 0i]", () => {
      expect(
        multiply(complex(0, -0.5), complex(-Infinity, 0)),
      ).toEqual(complex(0, Infinity));
    });

    it("is Real for real inputs", () => {
      expect(multiply(real(4), real(5))).toEqual(real(20));
    });
  });

  describe("with unbound inputs", () => {
    it("squares equal inputs", () => {
      expect(
        multiply(variable("x"), variable("x")),
      ).toEqual(square(variable("x")));
    });

    it("moves numeric values left-ward as coefficients", () => {
      expect(
        multiply(variable("x"), real(5)),
      ).toEqual(multiply(real(5), variable("x")));
      expect(
        multiply(variable("x"), complex(0, 1)),
      ).toEqual(multiply(complex(0, 1), variable("x")));
    });
  });

  describe("with nested multiplications", () => {
    it("coalesces numeric values across the nesting threshold", () => {
      expect(
        multiply(real(5), multiply(variable("x"), real(10))),
      ).toEqual(multiply(variable("x"), real(50)));
    });

    it("coalesces unbound inputs across the nesting threshold", () => {
      expect(
        multiply(variable("x"), multiply(real(5), variable("x"))),
      ).toEqual(multiply(real(5), square(variable("x"))));
    });

    it("returns a sorted monomial for uncombinable terms", () => {
      expect(
        multiply(variable("z"), multiply(variable("y"), variable("x"))),
      ).toEqual(
        new Multiplication(
          multiply(variable("x"), variable("y")),
          variable("z"),
        ),
        // multiply(variable("x"), multiply(variable("y"), variable("z"))),
      );
    });

    it("places a coefficient as left branch of root node", () => {
      expect(
        multiply(
          multiply(variable("z"), variable("x")),
          multiply(variable("y"), real(5)),
        ),
      ).toEqual(
        new Multiplication(
          real(5),
          new Multiplication(
            multiply(variable("x"), variable("y")),
            variable("z"),
          ),
        ),
      );
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
