import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Multiplication, Real, Variable } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex, ComplexInfinity } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { negate } from "./negate.ts";
import { raise, reciprocal, square } from "./raise.ts";
import { cos } from "./trigonometric.ts";
import { $add } from "./add.ts";
import { double, multiply } from "./multiply.ts";
import { $divide } from "./divide.ts";

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

    it("sorts terms (binary) by monolex", () => {
      expect(
        multiply(variable("y"), variable("x")),
      ).toEqual(new Multiplication(variable("x"), variable("y")));
      expect(
        multiply(cos(variable("x")), variable("x")),
      ).toEqual(
        new Multiplication(variable("x"), cos(variable("x"))),
      );
    });

    it("returns 0 if it has a 0 coefficient", () => {
      expect(
        multiply(variable("x"), real(0)),
      ).toEqual(real(0));
      expect(
        multiply(variable("x"), complex(0, 0)),
      ).toEqual(complex(0, 0));
      expect(
        multiply(variable("x"), boolean(false)),
      ).toEqual(boolean(false));
    });

    it("returns the other multiplicand if it has a 1 coefficient", () => {
      expect(
        multiply(variable("x"), real(1)),
      ).toEqual(variable("x"));
      expect(
        multiply(variable("x"), complex(1, 0)),
      ).toEqual(variable("x"));
      expect(
        multiply(variable("x"), boolean(true)),
      ).toEqual(variable("x"));
    });
  });

  describe("with similarly based exponentiatons", () => {
    it("adds to the power when multiplying by the base from the left", () => {
      expect(
        multiply(variable("x"), square(variable("x"))),
      ).toEqual(
        raise(variable("x"), real(3)),
      );
    });

    it("adds to the power when multiplying by the base from the right", () => {
      expect(
        multiply(square(variable("x")), variable("x")),
      ).toEqual(
        raise(variable("x"), real(3)),
      );
    });

    it("combines equivalently-based powers together", () => {
      expect(
        multiply(square(variable("x")), raise(variable("x"), real(3))),
      ).toEqual(
        raise(variable("x"), real(5)),
      );
    });

    it("combines numeric bases", () => {
      expect(
        multiply(real(2), raise(real(2), variable("x"))),
      ).toEqual(
        raise(real(2), $add(variable("x"), real(1))),
      );
    });

    it("is 1 for multiplicative inverses", () => {
      expect(
        multiply(variable("x"), raise(variable("x"), real(-1))),
      ).toEqual(real(1));
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

  describe("with exponentiations in a nested context", () => {
    it("combines exponentiations with similar bases", () => {
      expect(
        multiply(
          square(variable("x")),
          multiply(
            variable("y"),
            raise(variable("x"), real(3)),
          ),
        ),
      ).toEqual(
        multiply(variable("y"), raise(variable("x"), real(5))),
      );
    });
  });

  describe("with exponentiations of -1", () => {
    it("converts from left to a division", () => {
      expect(
        multiply(
          reciprocal(variable("x")),
          variable("y"),
        ),
      ).toEqual($divide(variable("y"), variable("x")));
    });

    it("converts from right to a division", () => {
      expect(
        multiply(
          variable("y"),
          reciprocal(variable("x")),
        ),
      ).toEqual($divide(variable("y"), variable("x")));
    });

    it("does not convert for mutually negated powers", () => {
      expect(
        multiply(
          reciprocal(variable("x")),
          reciprocal(variable("y")),
        ),
      ).toEqual(
        new Multiplication(
          reciprocal(variable("x")),
          reciprocal(variable("y")),
        ),
      );
    });
  });

  describe("with divisions", () => {
    it("converts a left division to a multiplication", () => {
      expect(
        multiply(
          $divide(variable("x"), variable("y")),
          variable("x"),
        ),
      ).toEqual(multiply(square(variable("x")), reciprocal(variable("y"))));
    });

    it("converts a right division to a multiplication", () => {
      expect(
        multiply(
          variable("x"),
          $divide(variable("x"), variable("y")),
        ),
      ).toEqual(multiply(square(variable("x")), reciprocal(variable("y"))));
    });

    it("converts both divisions to multipications", () => {
      expect(
        multiply(
          $divide(variable("x"), variable("y")),
          $divide(variable("y"), variable("x")),
        ),
      ).toEqual(real(1));
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
