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
} from "../tree/unary/trigonometric/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { cos, cot, csc, sec, sin, tan } from "./trigonometric.ts";

describe("cos", () => {
  it("is Boolean for boolean input", () => {
    expect(cos(boolean(false))).toEqual(boolean(true));
  });

  it("is Complex for complex input", () => {
    expect(cos(complex(1, 2)).raw).toEqual({
      a: expect.closeTo(2.032723007019, 10),
      b: expect.closeTo(-3.051897799151, 10),
    });
  });

  it("is Real for real input", () => {
    expect(cos(real(Math.PI))).toEqual(real(-1));
  });

  it("is a Cosine for unbound input", () => {
    expect(cos(variable("x"))).toEqual(
      new Cosine(new Variable("x")),
    );
  });
});

describe("cot", () => {
  // TODO: investigate reciprocal and booleans
  // it("is Boolean for boolean input", () => {
  //   expect(cot(boolean(true))).toEqual(boolean(true));
  // });

  it("is Complex for complex input", () => {
    expect(cot(complex(1, 2)).raw).toEqual({
      a: expect.closeTo(0.0327977555337, 10),
      b: expect.closeTo(-0.9843292264581, 10),
    });
  });

  it("is Real for real input", () => {
    expect(cot(real(0.5))).toEqual(real(1 / Math.tan(0.5)));
  });

  it("is a Cotangent for unbound input", () => {
    expect(cot(variable("x"))).toEqual(
      new Cotangent(new Variable("x")),
    );
  });
});

describe("csc", () => {
  it("is Complex for complex input", () => {
    expect(csc(complex(1, 2)).raw).toEqual({
      a: expect.closeTo(0.228375065599, 10),
      b: expect.closeTo(-0.141363021612, 10),
    });
  });

  it("is Real for real input", () => {
    expect(csc(real(0.5))).toEqual(real(1 / Math.sin(0.5)));
  });

  it("is a Cosecant for unbound input", () => {
    expect(csc(variable("x"))).toEqual(
      new Cosecant(new Variable("x")),
    );
  });
});

describe("sec", () => {
  it("is Complex for complex input", () => {
    expect(sec(complex(1, 2)).raw).toEqual({
      a: expect.closeTo(0.15117629826, 10),
      b: expect.closeTo(0.22697367539, 10),
    });
  });

  it("is Real for real input", () => {
    expect(sec(real(0.5))).toEqual(real(1 / Math.cos(0.5)));
  });

  it("is a Secant for unbound input", () => {
    expect(sec(variable("x"))).toEqual(
      new Secant(new Variable("x")),
    );
  });
});

describe("sin", () => {
  it("is Complex for complex input", () => {
    expect(sin(complex(1, 2)).raw).toEqual({
      a: expect.closeTo(3.16577851321616, 10),
      b: expect.closeTo(1.95960104142160, 10),
    });
  });

  it("is Real for real input", () => {
    expect(sin(real(Math.PI)).raw).toBeCloseTo(0, 10);
  });

  it("is a Sine for unbound input", () => {
    expect(sin(variable("x"))).toEqual(
      new Sine(new Variable("x")),
    );
  });
});

describe("tan", () => {
  it("is Complex for complex input", () => {
    expect(tan(complex(1, 2)).raw).toEqual({
      a: expect.closeTo(0.033812826079, 10),
      b: expect.closeTo(1.014793616146, 10),
    });
  });

  it("is Real for real input", () => {
    expect(tan(real(0.5))).toEqual(real(Math.tan(0.5)));
  });

  it("is a Tangent for unbound input", () => {
    expect(tan(variable("x"))).toEqual(
      new Tangent(new Variable("x")),
    );
  });
});
