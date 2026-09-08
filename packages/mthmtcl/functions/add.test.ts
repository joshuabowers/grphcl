import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Addition, Variable } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { add } from "./add.ts";

describe("add", () => {
  describe("with pairs of numerics", () => {
    it("returns boolean for a pair of boolean inputs", () => {
      expect(add(boolean(true), boolean(false))).toEqual(boolean(true));
    });

    it("returns complex for a pair of complex inputs", () => {
      expect(add(complex(0, 1), complex(1, 0))).toEqual(complex(1, 1));
    });

    it("returns real for a pair of real inputs", () => {
      expect(add(real(1), real(2))).toEqual(real(3));
    });
  });

  describe("with mixed pairs of numerics", () => {
    it("returns real for boolean and real", () => {
      expect(add(boolean(true), real(4))).toEqual(real(5));
      expect(add(real(4), boolean(true))).toEqual(real(5));
    });

    it("returns complex for boolean and complex", () => {
      expect(add(boolean(true), complex(0, 1))).toEqual(complex(1, 1));
      expect(add(complex(0, 1), boolean(true))).toEqual(complex(1, 1));
    });

    it("returns complex for complex and real", () => {
      expect(add(complex(0, 1), real(1))).toEqual(complex(1, 1));
      expect(add(real(1), complex(0, 1))).toEqual(complex(1, 1));
    });
  });

  describe("with two variables", () => {
    it("returns an Addition of those variables", () => {
      expect(add(variable("x"), variable("y"))).toEqual(
        new Addition(new Variable("x"), new Variable("y")),
      );
    });
  });
});
