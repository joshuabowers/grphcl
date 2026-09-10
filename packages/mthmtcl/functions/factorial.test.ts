import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Factorial, Variable } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex, ComplexInfinity } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { factorial } from "./factorial.ts";
import { gamma } from "./gamma.ts";

describe("factorial", () => {
  it("is true for all boolean inputs", () => {
    expect(factorial(boolean(true))).toEqual(boolean(true));
    expect(factorial(boolean(false))).toEqual(boolean(true));
  });

  describe("when given degenerate inputs", () => {
    it("is complex(1, 0) for a complex input of 0", () => {
      expect(factorial(complex(0, 0))).toEqual(complex(1, 0));
    });

    it("is 1 for a real input of 0", () => {
      expect(factorial(real(0))).toEqual(real(1));
    });
  });

  describe("behaving recursively", () => {
    it("is complex(120, 0) for complex input 5", () => {
      expect(factorial(complex(5, 0))).toEqual(complex(120, 0));
    });

    it("is 120 for real input 5", () => {
      expect(factorial(real(5))).toEqual(real(120));
    });
  });

  describe("with negative integers", () => {
    it("is complex infinity for complex inputs", () => {
      expect(factorial(complex(-5, 0))).toEqual(ComplexInfinity);
    });

    it("is complex infinity for real inputs", () => {
      expect(factorial(real(-5))).toEqual(ComplexInfinity);
    });
  });

  describe("delegating with non integers", () => {
    it("calculates via gamma for real inputs", () => {
      expect(factorial(real(5.5))).toEqual(gamma(real(6.5)));
    });

    it("calculates via gamma for complex inputs", () => {
      expect(factorial(complex(1, 2))).toEqual(gamma(complex(2, 2)));
    });
  });

  it("is a Factorial for unbound input", () => {
    expect(factorial(variable("x"))).toEqual(
      new Factorial(new Variable("x")),
    );
  });
});
