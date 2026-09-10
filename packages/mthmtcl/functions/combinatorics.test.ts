import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Combination, Permutation, Variable } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { combine, permute } from "./combinatorics.ts";

describe("combine", () => {
  it("calculates the combination for boolean inputs", () => {
    expect(combine(boolean(false), boolean(false))).toEqual(boolean(true));
    expect(combine(boolean(false), boolean(true))).toEqual(boolean(false));
    expect(combine(boolean(true), boolean(false))).toEqual(boolean(true));
    expect(combine(boolean(true), boolean(true))).toEqual(boolean(true));
  });

  it("calculates the combination for complex inputs", () => {
    expect(combine(complex(0, 5), complex(1, 1)).raw).toEqual({
      a: expect.closeTo(-1.075594610779, 10),
      b: expect.closeTo(0.657018673056, 10),
    });
  });

  it("calculates the combination for real inputs", () => {
    expect(combine(real(5), real(3))).toEqual(real(10));
  });

  it("is a Combination for unbound input", () => {
    expect(combine(variable("n"), variable("r"))).toEqual(
      new Combination(new Variable("n"), new Variable("r")),
    );
  });
});

describe("permute", () => {
  it("calculates the combination for boolean inputs", () => {
    expect(permute(boolean(false), boolean(false))).toEqual(boolean(true));
    expect(permute(boolean(false), boolean(true))).toEqual(boolean(false));
    expect(permute(boolean(true), boolean(false))).toEqual(boolean(true));
    expect(permute(boolean(true), boolean(true))).toEqual(boolean(true));
  });

  it("calculates the combination for complex inputs", () => {
    expect(permute(complex(0, 5), complex(1, 1)).raw).toEqual({
      a: expect.closeTo(-0.927726831821, 10),
      b: expect.closeTo(0.060010755560, 10),
    });
  });

  it("calculates the combination for real inputs", () => {
    expect(permute(real(5), real(3))).toEqual(real(60));
  });

  it("is a Permuation for unbound inputs", () => {
    expect(permute(variable("n"), variable("r"))).toEqual(
      new Permutation(new Variable("n"), new Variable("r")),
    );
  });
});
