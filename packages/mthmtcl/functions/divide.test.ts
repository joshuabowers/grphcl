import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Division, Variable } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { divide } from "./divide.ts";

describe("divide", () => {
  describe("with pairs of numeric inputs", () => {
    it("is Boolan for boolean inputs", () => {
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

  it("is a Division for unbound inputs", () => {
    expect(divide(variable("x"), variable("y"))).toEqual(
      new Division(
        new Variable("x"),
        new Variable("y"),
      ),
    );
  });
});
