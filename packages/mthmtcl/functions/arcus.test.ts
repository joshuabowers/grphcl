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
} from "../tree/unary/arcus/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { acos, acot, acsc, asec, asin, atan } from "./arcus.ts";

describe("acos", () => {
  it("is Boolean for boolean input", () => {
    expect(acos(boolean(false))).toEqual(boolean(true));
  });

  it("is Complex for complex input", () => {
    expect(acos(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(1.57079632679, 10),
      b: expect.closeTo(-0.881373587, 10),
    });
  });

  it("is Real for real input", () => {
    expect(acos(real(1))).toEqual(real(0));
  });

  it("is a Cosine for unbound input", () => {
    expect(acos(variable("x"))).toEqual(
      new Cosine(new Variable("x")),
    );
  });
});

describe("acot", () => {
  it("is Boolean for boolean input", () => {
    expect(acot(boolean(true))).toEqual(boolean(true));
  });

  it("is Complex for complex input", () => {
    expect(acot(complex(1, 1)).raw).toEqual({
      a: expect.closeTo(0.553574358897, 10),
      b: expect.closeTo(-0.402359478108, 10),
    });
  });

  it("is Real for real input", () => {
    expect(acot(real(1)).raw).toBeCloseTo(0.78539816339, 10);
  });

  it("is a Cotangent for unbound input", () => {
    expect(acot(variable("x"))).toEqual(
      new Cotangent(new Variable("x")),
    );
  });
});

describe("acsc", () => {
  it("is Boolean for boolean input", () => {
    expect(acsc(boolean(true))).toEqual(boolean(true));
  });

  it("is Complex for complex input", () => {
    expect(acsc(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(0, 10),
      b: expect.closeTo(-0.881373587, 10),
    });
  });

  it("is Real for real input", () => {
    expect(acsc(real(1)).raw).toBeCloseTo(1.57079632679, 10);
  });

  it("is a Cosecant for unbound input", () => {
    expect(acsc(variable("x"))).toEqual(
      new Cosecant(new Variable("x")),
    );
  });
});

describe("asec", () => {
  it("is Boolean for boolean input", () => {
    expect(asec(boolean(true))).toEqual(boolean(false));
  });

  it("is Complex for complex input", () => {
    expect(asec(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(1.57079632679, 10),
      b: expect.closeTo(0.881373587, 10),
    });
  });

  it("is Real for real input", () => {
    expect(asec(real(2))).toEqual(real(Math.acos(0.5)));
  });

  it("is a Secant for unbound input", () => {
    expect(asec(variable("x"))).toEqual(
      new Secant(new Variable("x")),
    );
  });
});

describe("asin", () => {
  it("is Boolean for boolean input", () => {
    expect(asin(boolean(false))).toEqual(boolean(false));
  });

  it("is Complex for complex input", () => {
    expect(asin(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(0, 10),
      b: expect.closeTo(0.881373587, 10),
    });
  });

  it("is Real for real input", () => {
    expect(asin(real(1)).raw).toBeCloseTo(1.57079632679, 10);
  });

  it("is a Sine for unbound input", () => {
    expect(asin(variable("x"))).toEqual(
      new Sine(new Variable("x")),
    );
  });
});

describe("atan", () => {
  it("is Boolean for boolean input", () => {
    expect(atan(boolean(true))).toEqual(boolean(true));
  });

  it("is Complex for complex input", () => {
    expect(atan(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(0, 10),
      b: expect.closeTo(Infinity, 10),
    });
  });

  it("is Real for real input", () => {
    expect(atan(real(1)).raw).toBeCloseTo(0.78539816339, 10);
  });

  it("is a Tangent for unbound input", () => {
    expect(atan(variable("x"))).toEqual(
      new Tangent(new Variable("x")),
    );
  });
});
