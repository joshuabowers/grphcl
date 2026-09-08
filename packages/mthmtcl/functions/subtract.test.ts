import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Subtraction, Variable } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { subtract } from "./subtract.ts";

describe("subtract", () => {
  describe("with pairs of numeric inputs", () => {
    it("is Boolean for boolean inputs", () => {
      expect(
        subtract(boolean(true), boolean(true)),
      ).toEqual(boolean(false));
    });

    it("is Complex for complex inputs", () => {
      expect(
        subtract(complex(3, 4), complex(2, 3)),
      ).toEqual(complex(1, 1));
    });

    it("is Real for real inputs", () => {
      expect(subtract(real(2), real(3))).toEqual(real(-1));
    });
  });

  it("is a Subtraction for unbound inputs", () => {
    expect(subtract(variable("x"), variable("y"))).toEqual(
      new Subtraction(
        new Variable("x"),
        new Variable("y"),
      ),
    );
  });
});
