import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Division, Real } from "../tree/mod.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { Direction, limit } from "./limit.ts";
import { add } from "./add.ts";
import { subtract } from "./subtract.ts";
import { multiply } from "./multiply.ts";
import { divide } from "./divide.ts";
import { $raise, raise, reciprocal } from "./raise.ts";
import { negate } from "./negate.ts";

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

    it("is inifinity for [x/a] for [a > 0] as [x -> Inf]", () => {
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
          raise(variable("x"), real(5)),
          variable("x"),
          real(2),
          Direction.Both,
        ),
      ).toEqual(
        real(32),
      );
    });

    it("is [c ** (1/a)] for [x ** (1/a)] as [x -> c]", () => {
      expect(
        limit(
          raise(variable("x"), reciprocal(real(5))),
          variable("x"),
          real(10),
          Direction.Both,
        ),
      ).toEqual(
        real(10 ** 0.2),
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
  });
});
