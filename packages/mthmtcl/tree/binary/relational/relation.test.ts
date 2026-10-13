import { describe, it } from "node:test";
import { expect } from "@std/expect";
import type { TreeNode } from "../../treeNode.ts";
import { Real } from "../../fields/real.ts";
import { Variable } from "../../variable.ts";
import { Addition } from "../addition.ts";
import { Relation } from "./relation.ts";

const R = class extends Relation {};
const relation = (left: TreeNode, right: TreeNode) => new R(left, right);

describe("Relation", () => {
  describe("variables", () => {
    it("are discovered on construction", () => {
      expect(
        relation(new Variable("x"), new Variable("y")).variables,
      ).toEqual(new Set(["x", "y"]));
    });

    it("sorts alphabetically", () => {
      expect(
        relation(new Variable("y"), new Variable("x")).variables,
      ).toEqual(new Set(["x", "y"]));
    });

    it("are discovered within nested trees", () => {
      expect(
        relation(
          new Variable("x"),
          new Addition(new Variable("y"), new Variable("x")),
        ).variables,
      ).toEqual(new Set(["x", "y"]));
    });

    it("is empty if there are none", () => {
      expect(
        relation(
          new Real(5),
          new Real(1),
        ).variables,
      ).toEqual(new Set<string>());
    });
  });

  describe("dependent", () => {
    it("is the last variable, alphabetically", () => {
      expect(
        relation(new Variable("y"), new Variable("x")).dependent,
      ).toEqual("y");
    });

    it("is undefined if no variables found", () => {
      expect(
        relation(new Real(5), new Real(1)).dependent,
      ).toBeUndefined();
    });
  });

  describe("independent", () => {
    it("is every variable except the dependent variable", () => {
      expect(
        relation(new Variable("y"), new Variable("x")).independent,
      ).toEqual(["x"]);
    });

    it("is empty if no variables found", () => {
      expect(
        relation(new Real(5), new Real(1)).independent,
      ).toEqual([]);
    });
  });

  describe("isPlottable", () => {
    it("is false for more than 2 variables", () => {
      expect(
        relation(
          new Variable("z"),
          new Addition(
            new Variable("x"),
            new Variable("y"),
          ),
        ).isPlottable,
      ).toBeFalsy();
    });

    it("is false for zero variables", () => {
      expect(
        relation(
          new Real(5),
          new Real(1),
        ).isPlottable,
      ).toBeFalsy();
    });

    it("is false for a non-isolated dependent variable", () => {
      expect(
        relation(
          new Addition(
            new Variable("x"),
            new Variable("y"),
          ),
          new Real(5),
        ).isPlottable,
      ).toBeFalsy();
    });

    it("is false for non-left dependent variable", () => {
      expect(
        relation(
          new Variable("x"),
          new Variable("y"),
        ).isPlottable,
      ).toBeFalsy();
    });

    it("is false for non-isolated dependents on the right", () => {
      expect(
        relation(
          new Variable("y"),
          new Addition(new Variable("x"), new Variable("y")),
        ).isPlottable,
      ).toBeFalsy();
    });

    it("is true for a left, isolated dependent variable", () => {
      expect(
        relation(
          new Variable("y"),
          new Addition(
            new Variable("x"),
            new Real(5),
          ),
        ).isPlottable,
      ).toBeTruthy();
    });
  });
});
