import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Division, Variable } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { raise, square } from "./raise.ts";
import { divide } from "./divide.ts";
import { $multiply } from "./multiply.ts";

describe("divide", () => {
  describe("with pairs of numeric inputs", () => {
    it("is Boolean for boolean inputs", () => {
      expect(
        divide(boolean(false), boolean(true)),
      ).toEqual(boolean(false));
    });

    it("is Complex for complex inputs", () => {
      expect(
        divide(complex(1, 0), complex(1, 2)).raw,
      ).toEqual({
        a: expect.closeTo(0.2, 10),
        b: expect.closeTo(-0.4, 10),
      });
    });

    it("handles complex division of 0 correctly", () => {
      expect(
        divide(complex(0, 0), complex(0, 2)),
      ).toEqual(complex(0, 0));
    });

    it("is Real for real inputs", () => {
      expect(divide(real(10), real(5))).toEqual(real(2));
    });
  });

  describe("with special values", () => {
    it("is 0 if given an Infinite denominator", () => {
      expect(divide(variable("x"), real(Infinity))).toEqual(real(0));
    });

    it("is the numerator if denominator is 1", () => {
      expect(divide(variable("x"), real(1))).toEqual(variable("x"));
    });
  });

  describe("with similar bases", () => {
    it("is 1 for the multiplicative inverse", () => {
      expect(divide(variable("x"), variable("x"))).toEqual(real(1));
    });

    it("subtracts 1 from numerator exponential", () => {
      expect(
        divide(
          raise(variable("x"), real(3)),
          variable("x"),
        ),
      ).toEqual(square(variable("x")));
    });

    it("subtracts denominator exponent from numerator", () => {
      expect(
        divide(
          variable("x"),
          raise(variable("x"), real(3)),
        ),
      ).toEqual(raise(variable("x"), real(-2)));
    });

    it("subtracts powers of exponential numerators and denominators", () => {
      expect(
        divide(
          raise(variable("x"), real(3)),
          square(variable("x")),
        ),
      ).toEqual(variable("x"));
    });
  });

  describe("with multiplications", () => {
    it("converts and delegates to multiply for left", () => {
      expect(
        divide(
          $multiply(variable("x"), variable("y")),
          variable("x"),
        ),
      ).toEqual(variable("y"));
    });

    it("converts and delegates to multiply for right", () => {
      expect(
        divide(
          variable("x"),
          $multiply(variable("x"), variable("y")),
        ),
      ).toEqual(divide(real(1), variable("y")));
    });

    it("converts and delegates to multiply for both", () => {
      expect(
        divide(
          $multiply(variable("x"), variable("y")),
          $multiply(variable("y"), variable("z")),
        ),
      ).toEqual(divide(variable("x"), variable("z")));
    });
  });

  it("is a Division for unbound inputs", () => {
    expect(divide(variable("x"), variable("y"))).toEqual(
      new Division(
        new Variable("x"),
        new Variable("y"),
      ),
    );
  });
});
