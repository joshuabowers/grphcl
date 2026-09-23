import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Addition, Variable } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { double, multiply } from "./multiply.ts";
import { raise } from "./raise.ts";
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

  describe("when dealing with the additive identity", () => {
    it("returns the right operand if the left is zero", () => {
      expect(
        add(real(0), variable("x")),
      ).toEqual(
        variable("x"),
      );
    });

    it("returns the left operand if the right is zero", () => {
      expect(
        add(variable("x"), real(0)),
      ).toEqual(
        variable("x"),
      );
    });
  });

  describe("with nested additions", () => {
    it("coalesces numeric values across the nesting threshold", () => {
      expect(
        add(real(5), add(variable("x"), real(10))),
      ).toEqual(add(variable("x"), real(15)));
    });

    it("returns a single, non-additon node if fully coalesced", () => {
      expect(
        add(add(variable("x"), real(-1)), real(1)),
      ).toEqual(variable("x"));
    });

    it("coalesces equal unbound sub-trees into a double", () => {
      expect(
        add(variable("x"), add(real(5), variable("x"))),
      ).toEqual(add(real(5), double(variable("x"))));
    });

    it("sorts a numeric as the right child of the root operation", () => {
      expect(
        add(
          add(variable("x"), real(5)),
          add(variable("y"), real(10)),
        ),
      ).toEqual(
        add(
          add(variable("x"), variable("y")),
          real(15),
        ),
      );
    });
  });

  describe("with non-combinable nodes", () => {
    it("reorders numberics right-ward", () => {
      expect(
        add(real(5), variable("x")),
      ).toEqual(add(variable("x"), real(5)));
    });

    it("reorders nodes based on degree", () => {
      expect(
        add(variable("x"), raise(variable("x"), real(2))),
      ).toEqual(add(raise(variable("x"), real(2)), variable("x")));
    });
  });

  describe("when given nested multiplications with primitives", () => {
    // E.g. x + 2 * x <-> 3 * x
    it("adds 1 to left operand of right-nested-multiply", () => {
      expect(
        add(variable("x"), multiply(real(2), variable("x"))),
      ).toEqual(
        multiply(real(3), variable("x")),
      );
    });

    // E.g. 2 * x + x <-> 3 * x
    it("adds 1 to left operand of left-nested-multiply", () => {
      expect(
        add(multiply(real(2), variable("x")), variable("x")),
      ).toEqual(
        multiply(real(3), variable("x")),
      );
    });

    // E.g. 2 * x + 3 * x <-> 5 * x
    it("adds left operands of dual-nested-multiplies", () => {
      expect(
        add(
          multiply(real(2), variable("x")),
          multiply(real(3), variable("x")),
        ),
      ).toEqual(
        multiply(real(5), variable("x")),
      );
    });
  });

  describe("with two variables", () => {
    it("returns an Addition of those variables", () => {
      expect(add(variable("x"), variable("y"))).toEqual(
        new Addition(new Variable("x"), new Variable("y")),
      );
    });

    it("doubles a doubled-variable", () => {
      expect(
        add(variable("x"), variable("x")),
      ).toEqual(double(variable("x")));
    });
  });
});
