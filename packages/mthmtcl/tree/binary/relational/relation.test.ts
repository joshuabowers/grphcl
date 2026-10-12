import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Variable } from "../../variable.ts";
import { Relation } from "./relation.ts";

describe("Relation", () => {
  describe("variables", () => {
    it("are discovered on construction", () => {
      const R = class extends Relation {};
      expect(new R(new Variable("x"), new Variable("y")).variables)
        .toEqual(new Set(["x", "y"]));
    });
  });
});
