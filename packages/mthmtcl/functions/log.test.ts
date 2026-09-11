import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Logarithm, Real, Variable } from "../tree/mod.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { lb, lg, ln, log } from "./log.ts";

describe("log", () => {
  it("is Complex for complex inputs", () => {
    expect(log(complex(0, 1), complex(1, 2)).raw).toEqual({
      a: expect.closeTo(0.7048327646991, 10),
      b: expect.closeTo(-0.5122999987267, 10),
    });
  });

  it("is Real for real inputs", () => {
    expect(log(real(3), real(27))).toEqual(real(3));
  });

  it("is a Logarithm for unbound inputs", () => {
    expect(log(variable("b"), variable("x"))).toEqual(
      new Logarithm(
        new Variable("b"),
        new Variable("x"),
      ),
    );
  });
});

describe("lb", () => {
  it("is a Logarithm in base 2 of an unbound input", () => {
    expect(lb(variable("x"))).toEqual(
      new Logarithm(
        new Real(2),
        new Variable("x"),
      ),
    );
  });
});

describe("lg", () => {
  it("is a Logarithm in base 10 of an unbound input", () => {
    expect(lg(variable("x"))).toEqual(
      new Logarithm(
        new Real(10),
        new Variable("x"),
      ),
    );
  });
});

describe("ln", () => {
  it("is [-Infinity + 0i] for an input of complex 0", () => {
    expect(ln(complex(0, 0))).toEqual(complex(-Infinity, 0));
  });

  it("is a Logarithm in base `e` of an unbound input", () => {
    expect(ln(variable("x"))).toEqual(
      new Logarithm(
        new Real(Math.E),
        new Variable("x"),
      ),
    );
  });
});
