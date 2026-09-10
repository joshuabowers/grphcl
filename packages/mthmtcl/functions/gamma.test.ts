import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Gamma, Variable } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex, ComplexInfinity } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { gamma } from "./gamma.ts";

describe("gamma", () => {
  it("is true for all boolean inputs", () => {
    expect(gamma(boolean(false))).toEqual(boolean(true));
    expect(gamma(boolean(true))).toEqual(boolean(true));
  });

  describe("via delegation to factorial for positive integers", () => {
    it("is complex 120 for complex input 6", () => {
      expect(gamma(complex(6, 0))).toEqual(complex(120, 0));
    });

    it("is 120 for real input 6", () => {
      expect(gamma(real(6))).toEqual(real(120));
    });
  });

  it("is ComplexInfinity for non-positive integers", () => {
    expect(gamma(real(-5))).toEqual(ComplexInfinity);
  });

  describe("via approximation for non-integers", () => {
    it("calcualtes for complex inputs", () => {
      expect(gamma(complex(1, 1)).raw).toEqual({
        a: expect.closeTo(0.498015668118, 10),
        b: expect.closeTo(-0.154949828301, 10),
      });
    });

    it("calculates for positive real inputs", () => {
      expect(gamma(real(5.5)).raw).toBeCloseTo(
        52.34277778455362,
        10,
      );
    });

    it("calculates for negative real inputs", () => {
      expect(gamma(real(-5.5)).raw).toBeCloseTo(
        0.010912654781909826,
        10,
      );
    });
  });

  it("is a Gamma for unbound input", () => {
    expect(gamma(variable("x"))).toEqual(
      new Gamma(new Variable("x")),
    );
  });
});
