import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Division, Real } from "../tree/mod.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { $add, add } from "./add.ts";
import { $subtract, subtract } from "./subtract.ts";
import { multiply } from "./multiply.ts";
import { $divide, divide } from "./divide.ts";
import { $raise, raise, reciprocal } from "./raise.ts";
import { negate } from "./negate.ts";
import { $ln, ln } from "./log.ts";
import { Direction, limit } from "./limit.ts";

describe("limit", () => {
  it("is constant for a constant", () => {
    expect(
      limit(real(5), variable("x"), real(0), Direction.Both),
    ).toEqual(
      real(5),
    );
  });

  it("is the target for a variable", () => {
    expect(
      limit(variable("x"), variable("x"), real(10), Direction.Both),
    ).toEqual(
      real(10),
    );
  });

  describe("of additions", () => {
    it("is the addition of the limits of the subtrees", () => {
      expect(
        limit(
          add(variable("x"), real(5)),
          variable("x"),
          real(10),
          Direction.Both,
        ),
      ).toEqual(
        real(15),
      );
    });
  });

  describe("of subtractions", () => {
    it("is the subtraction of the limits of the subtrees", () => {
      expect(
        limit(
          subtract(variable("x"), real(5)),
          variable("x"),
          real(10),
          Direction.Both,
        ),
      ).toEqual(
        real(5),
      );
    });
  });

  describe("of multiplications", () => {
    it("is the multiplication of the limits of the subtrees", () => {
      expect(
        limit(
          multiply(variable("x"), real(5)),
          variable("x"),
          real(10),
          Direction.Both,
        ),
      ).toEqual(
        real(50),
      );
    });
  });

  describe("of divisions", () => {
    it("is the division of the limits of the subtrees", () => {
      expect(
        limit(
          divide(variable("x"), real(5)),
          variable("x"),
          real(10),
          Direction.Both,
        ),
      ).toEqual(
        real(2),
      );
    });

    it("is infinity for [x/a] for [a > 0] as [x -> Inf]", () => {
      expect(
        limit(
          divide(variable("x"), real(5)),
          variable("x"),
          real(Infinity),
          Direction.Both,
        ),
      ).toEqual(
        real(Infinity),
      );
    });

    it("is NaN for [x/a] for [a === 0] as [x -> Inf]", () => {
      // NB: this will only work, specifically, for Division
      //     nodes; if this were created by `divide`, the
      //     intermediate internal representation would be a
      //     multiplication against Infinity, which would fail
      //     this test.
      const n = limit(
        new Division(variable("x"), real(0)),
        variable("x"),
        real(Infinity),
        Direction.Both,
      );
      expect(n).toBeInstanceOf(Real);
      expect((n as unknown as Real).raw).toBeNaN();
    });

    it("is -Infinity for [x/a] for [a < 0] as [x -> Inf]", () => {
      expect(
        limit(
          divide(variable("x"), real(-5)),
          variable("x"),
          real(Infinity),
          Direction.Both,
        ),
      ).toEqual(
        real(-Infinity),
      );
    });
  });

  describe("of exponentiations", () => {
    it("is [c ** a] for [x ** a] as [x -> c]", () => {
      expect(
        limit(
          raise(variable("x"), variable("a")),
          variable("x"),
          variable("c"),
          Direction.Both,
        ),
      ).toEqual(
        raise(variable("c"), variable("a")),
      );
    });

    it("is [c ** (1/a)] for [x ** (1/a)] as [x -> c]", () => {
      expect(
        limit(
          raise(variable("x"), reciprocal(variable("a"))),
          variable("x"),
          variable("c"),
          Direction.Both,
        ),
      ).toEqual(
        raise(variable("c"), reciprocal(variable("a"))),
      );
    });

    it("is Infinity for [x ** (1/a)] for [a > 0] as [x -> Inf]", () => {
      expect(
        limit(
          raise(variable("x"), reciprocal(real(5))),
          variable("x"),
          real(Infinity),
          Direction.Both,
        ),
      ).toEqual(
        real(Infinity),
      );
    });

    it("is 0 for [a * x ** -1] as [x -> Inf]", () => {
      expect(
        limit(
          multiply(real(5), reciprocal(variable("x"))),
          variable("x"),
          real(Infinity),
          Direction.Both,
        ),
      ).toEqual(
        real(0),
      );
    });

    it("is Infinity for [x ** -a] as [x -> 0+]", () => {
      expect(
        limit(
          raise(variable("x"), real(-5)),
          variable("x"),
          real(0),
          Direction.Right,
        ),
      ).toEqual(
        real(Infinity),
      );
    });

    it("is Infinity for [x ** -a] as [x -> 0-], a even", () => {
      expect(
        limit(
          raise(variable("x"), real(-4)),
          variable("x"),
          real(0),
          Direction.Left,
        ),
      ).toEqual(
        real(Infinity),
      );
    });

    it("is -Infinity for [x ** -a] as [x -> 0-], a odd", () => {
      expect(
        limit(
          $raise(variable("x"), real(-5)),
          variable("x"),
          real(0),
          Direction.Left,
        ),
      ).toEqual(
        real(-Infinity),
      );
    });

    it("is Infinity for [a ** x] as [x -> Inf] for a > 1", () => {
      expect(
        limit(
          raise(real(5), variable("x")),
          variable("x"),
          real(Infinity),
          Direction.Both,
        ),
      ).toEqual(
        real(Infinity),
      );
    });

    it("is 1 for [a ** x] as [x -> Inf] for a === 1", () => {
      expect(
        limit(
          raise(real(1), variable("x")),
          variable("x"),
          real(Infinity),
          Direction.Both,
        ),
      ).toEqual(
        real(1),
      );
    });

    it("is 0 for [a ** x] as [x -> Inf] for [0 < a < 1]", () => {
      expect(
        limit(
          raise(real(0.5), variable("x")),
          variable("x"),
          real(Infinity),
          Direction.Both,
        ),
      ).toEqual(
        real(0),
      );
    });

    it("is 0 for [a ** -x] as [x -> Inf] for a > 1", () => {
      expect(
        limit(
          raise(real(5), negate(variable("x"))),
          variable("x"),
          real(Infinity),
          Direction.Both,
        ),
      ).toEqual(
        real(0),
      );
    });

    it("is 1 for [a ** -x] as [x -> Inf] for a === 1", () => {
      expect(
        limit(
          raise(real(1), negate(variable("x"))),
          variable("x"),
          real(Infinity),
          Direction.Both,
        ),
      ).toEqual(
        real(1),
      );
    });

    it("is Infinity for [a ** -x] as [x -> Inf] for [0 < a < 1]", () => {
      expect(
        limit(
          raise(real(0.5), negate(variable("x"))),
          variable("x"),
          real(Infinity),
          Direction.Both,
        ),
      ).toEqual(
        real(Infinity),
      );
    });

    it("is 1 for [a ** (1/x)] as [x -> Inf] for a > 0", () => {
      expect(
        limit(
          raise(real(5), reciprocal(variable("x"))),
          variable("x"),
          real(Infinity),
          Direction.Both,
        ),
      ).toEqual(
        real(1),
      );
    });

    it("is 0 for [a ** (1/x)] as [x -> Inf] for a === 0", () => {
      expect(
        limit(
          raise(real(0), reciprocal(variable("x"))),
          variable("x"),
          real(Infinity),
          Direction.Both,
        ),
      ).toEqual(
        real(0),
      );
    });

    it("is NaN for [a ** (1/x)] as [x -> Inf] for a < 0", () => {
      const actual = limit(
        raise(real(-5), reciprocal(variable("x"))),
        variable("x"),
        real(Infinity),
        Direction.Both,
      );
      expect(actual).toBeInstanceOf(Real);
      expect(
        (actual as unknown as Real).raw,
      ).toBeNaN();
    });

    it("is 1 for [x ** (1/x)] as [x -> Inf]", () => {
      expect(
        limit(
          raise(variable("x"), reciprocal(variable("x"))),
          variable("x"),
          real(Infinity),
          Direction.Both,
        ),
      ).toEqual(
        real(1),
      );
    });

    it("is 1 for [x ** x] as [x -> 0]", () => {
      expect(
        limit(
          raise(variable("x"), variable("x")),
          variable("x"),
          real(0),
          Direction.Both,
        ),
      ).toEqual(
        real(1),
      );
    });
  });

  describe("of logarithms", () => {
    it("is c for [ln(x)] as [x -> c]", () => {
      expect(
        limit(
          ln(variable("x")),
          variable("x"),
          variable("c"),
          Direction.Both,
        ),
      ).toEqual(
        ln(variable("c")),
      );
    });

    it("is -Infinity for [ln(x)] as [x -> 0+]", () => {
      expect(
        limit(
          ln(variable("x")),
          variable("x"),
          real(0),
          Direction.Right,
        ),
      ).toEqual(
        real(-Infinity),
      );
    });

    it("is Infinity for [ln(x)] as [x -> Inf]", () => {
      expect(
        limit(
          ln(variable("x")),
          variable("x"),
          real(Infinity),
          Direction.Both,
        ),
      ).toEqual(
        real(Infinity),
      );
    });

    it("is 1 for [ln(x) / (x-1)] as [x -> 1], raw", () => {
      expect(
        limit(
          $divide($ln(variable("x")), $subtract(variable("x"), real(1))),
          variable("x"),
          real(1),
          Direction.Both,
        ),
      ).toEqual(
        real(1),
      );
    });

    it("is 1 for [ln(x) / (x-1)] as [x -> 1], canonicalized", () => {
      expect(
        limit(
          divide(ln(variable("x")), subtract(variable("x"), real(1))),
          variable("x"),
          real(1),
          Direction.Both,
        ),
      ).toEqual(
        real(1),
      );
    });

    it("is 1 for [ln(x + 1) / x] as [x -> 0], raw", () => {
      expect(
        limit(
          $divide($ln($add(variable("x"), real(1))), variable("x")),
          variable("x"),
          real(0),
          Direction.Both,
        ),
      ).toEqual(
        real(1),
      );
    });

    it("is 1 for [ln(x + 1) / x] as [x -> 0], canonicalized", () => {
      expect(
        limit(
          divide(ln(add(variable("x"), real(1))), variable("x")),
          variable("x"),
          real(0),
          Direction.Both,
        ),
      ).toEqual(
        real(1),
      );
    });

    it("is 0 for [x * ln(x)] as [x -> 0]", () => {
      expect(
        limit(
          multiply(variable("x"), ln(variable("x"))),
          variable("x"),
          real(0),
          Direction.Both,
        ),
      ).toEqual(
        real(0),
      );
    });

    it("is 0 for [ln(x) / x] as [x -> Inf]", () => {
      expect(
        limit(
          divide(ln(variable("x")), variable("x")),
          variable("x"),
          real(Infinity),
          Direction.Both,
        ),
      ).toEqual(
        real(0),
      );
    });
  });
});
