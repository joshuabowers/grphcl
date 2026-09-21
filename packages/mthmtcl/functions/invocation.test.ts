import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { scope, variable } from "./variable.ts";
import { $add } from "./add.ts";
import { multiply } from "./multiply.ts";
import { cos } from "./trigonometric.ts";
import { invoke } from "./invocation.ts";

describe("invoke", () => {
  describe("with no passed scope", () => {
    it("applies its arguments to unbound variables", () => {
      expect(
        invoke()($add(variable("x"), variable("y")))(real(5), real(10)),
      ).toEqual(
        real(15),
      );
    });

    it("applies its arguments in alphabetical order", () => {
      expect(
        invoke()($add(variable("x"), variable("y")))(real(5)),
      ).toEqual(
        $add(real(5), variable("y")),
      );
    });
  });

  describe("with a passed scope but no arguments", () => {
    it("evaluates any unbound variables against its scope", () => {
      const s = scope([["x", real(5)]]);

      expect(
        invoke(s)($add(variable("x"), variable("y")))(),
      ).toEqual(
        $add(real(5), variable("y")),
      );
    });
  });

  describe("with a passed scope and arguments", () => {
    it("evaluates any unbound variables against argument overridden scope", () => {
      const s = scope([["x", real(5)]]);

      expect(
        invoke(s)($add(variable("x"), variable("y")))(real(10)),
      ).toEqual(
        $add(real(10), variable("y")),
      );
    });
  });

  describe("when given an expression with multiple instances of a variable", () => {
    it("substitutes a newly bound value for each variable instance", () => {
      expect(
        invoke()(multiply(variable("x"), $add(variable("x"), real(5))))(
          real(4),
        ),
      ).toEqual(
        real(36),
      );
    });
  });

  describe("of specific node types", () => {
    it("returns reals directly", () => {
      expect(
        invoke()(real(5))(),
      ).toEqual(
        real(5),
      );
    });

    it("returns complex numbers directly", () => {
      expect(
        invoke()(complex(1, 5))(),
      ).toEqual(
        complex(1, 5),
      );
    });

    it("returns booleans directly", () => {
      expect(
        invoke()(boolean(true))(),
      ).toEqual(
        boolean(true),
      );
    });

    it("returns unbound variables directly", () => {
      expect(
        invoke()(variable("x"))(),
      ).toEqual(
        variable("x"),
      );
    });

    it("returns the value of an argument-bound variable", () => {
      expect(
        invoke()(variable("x"))(real(5)),
      ).toEqual(
        real(5),
      );
    });

    it("returns the value of a scope-bound variable", () => {
      const s = scope([["x", real(5)]]);
      expect(
        invoke(s)(variable("x"))(),
      ).toEqual(
        real(5),
      );
    });

    it("substitutes a variable with an unbound variable argument", () => {
      expect(
        invoke()(variable("x"))(variable("y")),
      ).toEqual(
        variable("y"),
      );
    });

    it("evaluates left child variables of binaries", () => {
      expect(
        invoke()($add(variable("x"), real(5)))(real(10)),
      ).toEqual(
        real(15),
      );
    });

    it("evaluates right child variables of binaries", () => {
      expect(
        invoke()(multiply(real(5), variable("x")))(real(10)),
      ).toEqual(
        real(50),
      );
    });

    it("evaluates child variables of unary nodes", () => {
      expect(
        invoke()(cos(variable("x")))(real(Math.PI)),
      ).toEqual(
        real(-1),
      );
    });
  });
});
