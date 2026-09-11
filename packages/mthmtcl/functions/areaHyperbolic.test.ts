import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Variable } from "../tree/mod.ts";
import {
  Cosecant,
  Cosine,
  Cotangent,
  Secant,
  Sine,
  Tangent,
} from "../tree/unary/areaHyperbolic/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { acosh, acoth, acsch, asech, asinh, atanh } from "./areaHyperbolic.ts";

describe("acosh", () => {
  it("is Boolean for boolean input", () => {
    expect(acosh(boolean(false))).toEqual(boolean(true));
  });

  it("is Complex for complex input", () => {
    expect(acosh(complex(2, 1)).raw).toEqual({
      a: expect.closeTo(1.469351744368, 10),
      b: expect.closeTo(0.507356303217, 10),
    });
  });

  it("is Real for real input", () => {
    expect(acosh(real(1))).toEqual(real(0));
  });

  it("is a Cosine for unbound input", () => {
    expect(acosh(variable("x"))).toEqual(
      new Cosine(new Variable("x")),
    );
  });
});

describe("acoth", () => {
  it("is Boolean for boolean input", () => {
    expect(acoth(boolean(true))).toEqual(boolean(true));
  });

  it("is Complex for complex input", () => {
    expect(acoth(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(0, 10),
      b: expect.closeTo(-0.78539816339, 10),
    });
  });

  it("is Real for real input", () => {
    expect(acoth(real(1))).toEqual(real(Infinity));
  });

  it("is a Cotangent for unbound input", () => {
    expect(acoth(variable("x"))).toEqual(
      new Cotangent(new Variable("x")),
    );
  });
});

describe("acsch", () => {
  it("is Boolean for boolean input", () => {
    expect(acsch(boolean(true))).toEqual(boolean(true));
  });

  it("is Complex for complex input", () => {
    expect(acsch(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(0, 7),
      b: expect.closeTo(-1.570796318969787, 10),
    });
  });

  it("is Real for real input", () => {
    expect(acsch(real(1)).raw).toBeCloseTo(0.88137358701, 10);
  });

  it("is a Cosecant for unbound input", () => {
    expect(acsch(variable("x"))).toEqual(
      new Cosecant(new Variable("x")),
    );
  });
});

describe("asech", () => {
  it("is Boolean for boolean input", () => {
    expect(asech(boolean(true))).toEqual(boolean(false));
  });

  it("is Complex for complex input", () => {
    expect(asech(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(0.88137358701, 10),
      b: expect.closeTo(-1.57079632679, 10),
    });
  });

  it("is Real for real input", () => {
    expect(asech(real(0.5)).raw).toBeCloseTo(1.3169578969, 10);
  });

  it("is a Secant for unbound input", () => {
    expect(asech(variable("x"))).toEqual(
      new Secant(new Variable("x")),
    );
  });
});

describe("asinh", () => {
  it("is Boolean for boolean input", () => {
    expect(asinh(boolean(false))).toEqual(boolean(false));
  });

  it("is Complex for complex input", () => {
    expect(asinh(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(0, 7),
      b: expect.closeTo(1.570796318969787, 10),
    });
  });

  it("is Real for real input", () => {
    expect(asinh(real(1)).raw).toBeCloseTo(0.88137358701, 10);
  });

  it("is a Sine for unbound input", () => {
    expect(asinh(variable("x"))).toEqual(
      new Sine(new Variable("x")),
    );
  });
});

describe("atanh", () => {
  it("is Boolean for boolean input", () => {
    expect(atanh(boolean(true))).toEqual(boolean(true));
  });

  it("is Complex for complex input", () => {
    expect(atanh(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(0, 10),
      b: expect.closeTo(0.78539816339, 10),
    });
  });

  it("is Real for real input", () => {
    expect(atanh(real(1))).toEqual(real(Infinity));
  });

  it("is a Tangent for unbound input", () => {
    expect(atanh(variable("x"))).toEqual(
      new Tangent(new Variable("x")),
    );
  });
});
