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
} from "../tree/unary/hyperbolic/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { cosh, coth, csch, sech, sinh, tanh } from "./hyperbolic.ts";

describe("cosh", () => {
  it("is Boolean for boolean input", () => {
    expect(cosh(boolean(false))).toEqual(boolean(true));
  });

  it("is Complex for complex input", () => {
    expect(cosh(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(0.540302305868, 10),
      b: expect.closeTo(0, 10),
    });
  });

  it("is Real for real input", () => {
    expect(cosh(real(1)).raw).toBeCloseTo(1.543080634815, 10);
  });

  it("is a Cosine for unbound input", () => {
    expect(cosh(variable("x"))).toEqual(
      new Cosine(new Variable("x")),
    );
  });
});

describe("coth", () => {
  it("is Boolean for boolean input", () => {
    expect(coth(boolean(true))).toEqual(boolean(true));
  });

  it("is Complex for complex input", () => {
    expect(coth(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(0, 10),
      b: expect.closeTo(-0.642092615934, 10),
    });
  });

  it("is Real for real input", () => {
    expect(coth(real(1))).toEqual(real(1 / Math.tanh(1)));
  });

  it("is a Cotangent for unbound input", () => {
    expect(coth(variable("x"))).toEqual(
      new Cotangent(new Variable("x")),
    );
  });
});

describe("csch", () => {
  it("is Boolean for boolean input", () => {
    expect(csch(boolean(true))).toEqual(boolean(true));
  });

  it("is Complex for complex input", () => {
    expect(csch(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(0, 10),
      b: expect.closeTo(-1.188395105778, 10),
    });
  });

  it("is Real for real input", () => {
    expect(csch(real(1))).toEqual(real(1 / Math.sinh(1)));
  });

  it("is a Cosecant for unbound input", () => {
    expect(csch(variable("x"))).toEqual(
      new Cosecant(new Variable("x")),
    );
  });
});

describe("sech", () => {
  it("is Boolean for boolean input", () => {
    expect(sech(boolean(true))).toEqual(boolean(true));
  });

  it("is Complex for complex input", () => {
    expect(sech(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(1.850815717680, 10),
      b: expect.closeTo(0, 10),
    });
  });

  it("is Real for real input", () => {
    expect(sech(real(1))).toEqual(real(1 / Math.cosh(1)));
  });

  it("is a Secant for unbound input", () => {
    expect(sech(variable("x"))).toEqual(
      new Secant(new Variable("x")),
    );
  });
});

describe("sinh", () => {
  it("is Boolean for boolean input", () => {
    expect(sinh(boolean(false))).toEqual(boolean(false));
  });

  it("is Complex for complex input", () => {
    expect(sinh(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(0, 10),
      b: expect.closeTo(0.841470984807, 10),
    });
  });

  it("is Real for real input", () => {
    expect(sinh(real(1)).raw).toBeCloseTo(1.175201193643, 10);
  });

  it("is a Sine for unbound input", () => {
    expect(sinh(variable("x"))).toEqual(
      new Sine(new Variable("x")),
    );
  });
});

describe("tanh", () => {
  it("is Boolean for boolean input", () => {
    expect(tanh(boolean(true))).toEqual(boolean(true));
  });

  it("is Complex for complex input", () => {
    expect(tanh(complex(0, 1)).raw).toEqual({
      a: expect.closeTo(0, 10),
      b: expect.closeTo(1.557407724654, 10),
    });
  });

  it("is Real for real input", () => {
    expect(tanh(real(1))).toEqual(real(Math.tanh(1)));
  });

  it("is a Tangent for unbound input", () => {
    expect(tanh(variable("x"))).toEqual(
      new Tangent(new Variable("x")),
    );
  });
});
