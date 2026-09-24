import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Polygamma } from "../tree/mod.ts";
import { complex } from "./complex.ts";
import { EulerMascheroni, real } from "./real.ts";
import { variable } from "./variable.ts";
import { negate } from "./negate.ts";
import { digamma, polygamma } from "./polygamma.ts";

describe("digamma", () => {
  describe("for large inputs", () => {
    it("calculates an approximate value for positive reals", () => {
      expect(
        digamma(real(10)).raw,
      ).toBeCloseTo(2.2517525890667, 10);
    });

    it("calculates an approximate value for complex numbers", () => {
      expect(
        digamma(complex(0, 10)).raw,
      ).toEqual({
        a: expect.closeTo(2.3034192636714, 10),
        b: expect.closeTo(1.6207963267948, 10),
      });
    });
  });

  describe("for negative inputs", () => {
    it("reflects and calculates for a mapped positive real", () => {
      expect(
        digamma(real(-100.5)).raw,
      ).toBeCloseTo(4.61512460133, 10);
    });
  });

  describe("for small positive inputs", () => {
    it("uses a recurrence relation to calculate for a mapped large real", () => {
      expect(
        digamma(real(1)).raw,
      ).toBeCloseTo(
        negate(EulerMascheroni).raw,
        10,
      );
    });

    it("uses a recurrence relation to calculate for a mapped large complex", () => {
      expect(
        digamma(complex(1, 1)).raw,
      ).toEqual({
        a: expect.closeTo(0.094650320622, 10),
        b: expect.closeTo(1.076674047468, 10),
      });
    });
  });

  it("is the zeroth Polygamma of its indeterminate input", () => {
    expect(
      digamma(variable("x")),
    ).toEqual(new Polygamma(real(0), variable("x")));
  });
});

describe("polygamma", () => {
  describe("for large inputs", () => {
    it("calculates an approximate value for positive reals for m=1", () => {
      expect(
        polygamma(real(1), real(100)).raw,
      ).toBeCloseTo(0.0100501666633, 10);
    });

    it("calculates an approximate value for complex numbers for m=1", () => {
      expect(
        polygamma(real(1), complex(0, 100)).raw,
      ).toEqual({
        a: expect.closeTo(-0.0000499999999, 10),
        b: expect.closeTo(-0.0099998333299, 10),
      });
    });
  });

  describe("for negative inputs", () => {
    it("reflects and calculates for a mapped positive real", () => {
      expect(
        polygamma(real(1), real(-100.5)).raw,
      ).toBeCloseTo(9.85970349187, 10);
    });
  });

  describe("for small positive inputs", () => {
    it("uses a recurrence relation to calculate for a mapped large", () => {
      expect(
        polygamma(real(1), real(1)).raw,
      ).toBeCloseTo(1.644934066848, 10);
    });

    it("uses a recurrence relation to calculate for a mapped large complex", () => {
      expect(
        polygamma(real(1), complex(1, 1)).raw,
      ).toEqual({
        a: expect.closeTo(0.463000096622, 10),
        b: expect.closeTo(-0.794233542759, 10),
      });
    });
  });

  it("is a Polygamma for indeterminate inputs", () => {
    expect(
      polygamma(variable("x"), variable("y")),
    ).toEqual(new Polygamma(variable("x"), variable("y")));
  });
});
