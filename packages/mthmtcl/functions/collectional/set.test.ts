import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Rostered } from "../../tree/fields/rostered.ts";
import { Built } from "../../tree/fields/built.ts";
import { Real } from "../../tree/fields/real.ts";
import { Boolean } from "../../tree/fields/boolean.ts";
import { LessThan } from "../../tree/binary/relational/mod.ts";
import { is } from "../../factories/factory.ts";
import { real } from "../real.ts";
import { boolean } from "../boolean.ts";
import { variable } from "../variable.ts";
import { gt, lt, nequals } from "../relational.ts";
import { and } from "../logical/mod.ts";
import { invoke } from "../invocation.ts";
import { Empty, set, Universe } from "./set.ts";

describe("set", () => {
  describe("when rostered", () => {
    it("creates an empty Rostered set for no arguments", () => {
      expect(set()).toBeInstanceOf(Rostered);
    });

    it("creates a Rostered set from 1 TreeNode argument", () => {
      expect(set(real(1))).toBeInstanceOf(Rostered);
    });

    it("creates a Rostered from multiple TreeNode arguments", () => {
      expect(set(real(1), real(2), real(3))).toBeInstanceOf(Rostered);
    });

    it("is finite, with a size equal to the number of elements", () => {
      expect(set(real(1), real(2), real(3)).size).toBe(3);
    });

    it("has 0 size for the empty set", () => {
      expect((set() as Rostered).elements).toEqual([]);
      expect(set().size).toBe(0);
    });

    it("constains a rostered element", () => {
      expect(
        set(real(1), real(2), real(3)).has(real(2)),
      ).toEqual(boolean(true));
    });

    it("does not contain an unrostered element", () => {
      expect(
        set(real(1), real(2), real(3)).has(real(5)),
      ).toEqual(boolean(false));
    });

    it("only contains a single instance of a rostered element", () => {
      const s = set(real(1), real(3), real(2), real(1), real(3));
      expect(s.size).toBe(3);
      expect((s as Rostered).elements).toEqual([real(1), real(3), real(2)]);
    });
  });

  describe("when built", () => {
    it("creates a Built set from a function", () => {
      expect(
        set((x) => gt(x, real(0))),
      ).toBeInstanceOf(Built);
    });

    it("is infinite", () => {
      expect(set((x) => gt(x, real(0))).size).toBe(Infinity);
    });

    it("includes values which are in the set", () => {
      expect(
        set((x) => gt(x, real(0))).has(real(10)),
      ).toEqual(boolean(true));
    });

    it("does not include values which are not in the set", () => {
      expect(
        set((x) => gt(x, real(0))).has(real(-10)),
      ).toEqual(boolean(false));
    });

    it("supports (via chicanery) arbitrary functions", () => {
      const integers = set((x) =>
        boolean(is(Real)(x) && Number.isInteger(x.raw))
      );
      expect(
        integers.has(real(5)),
      ).toEqual(boolean(true));
      expect(
        integers.has(real(1.5)),
      ).toEqual(boolean(false));
    });

    it("supports exclusionary definitions", () => {
      const nonZero = set((x) => nequals(x, real(0)));
      expect(
        nonZero.has(real(-1)),
      ).toEqual(boolean(true));
      expect(
        nonZero.has(real(1)),
      ).toEqual(boolean(true));
      expect(
        nonZero.has(real(0)),
      ).toEqual(boolean(false));
    });

    it("supports logical connectives", () => {
      const range = set((x) => and(gt(x, real(0)), lt(x, real(10))));
      expect(range.has(real(5))).toEqual(boolean(true));
      expect(range.has(real(-5))).toEqual(boolean(false));
      expect(range.has(real(15))).toEqual(boolean(false));
    });

    it("supports invocations", () => {
      const s = set((x) => {
        const value = invoke()(new LessThan(variable("x"), real(10)))(x);
        return is(Boolean)(value) ? value : boolean(false);
      });
      expect(s.has(real(0))).toEqual(boolean(true));
      expect(s.has(real(15))).toEqual(boolean(false));
    });
  });

  describe("when built with a superset", () => {
    it("creates a Built set from a function and a superset", () => {
      const positive = set((x) => gt(x, real(0)));
      expect(
        set((x) => lt(x, real(100)), positive),
      ).toBeInstanceOf(Built);
    });

    it("includes values in both its superset and itself", () => {
      const positive = set((x) => gt(x, real(0)));
      expect(
        set((x) => lt(x, real(100)), positive).has(real(50)),
      ).toEqual(boolean(true));
    });

    it("does not include values not within superset but in self", () => {
      const positive = set((x) => gt(x, real(0)));
      expect(
        set((x) => lt(x, real(100)), positive).has(real(-10)),
      ).toEqual(boolean(false));
    });

    it("does not include values outside itself but in superset", () => {
      const positive = set((x) => gt(x, real(0)));
      expect(
        set((x) => lt(x, real(100)), positive).has(real(150)),
      ).toEqual(boolean(false));
    });
  });
});

describe("Universe", () => {
  it("has infinite size", () => {
    expect(Universe.size).toEqual(Infinity);
  });

  it("contains every element", () => {
    expect(Universe.has(real(5))).toEqual(boolean(true));
  });
});

describe("Empty", () => {
  it("has a size of 0", () => {
    expect(Empty.size).toEqual(0);
  });

  it("does not contain any element", () => {
    expect(Empty.has(real(5))).toEqual(boolean(false));
  });
});
