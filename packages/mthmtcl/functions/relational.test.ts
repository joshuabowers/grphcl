import { describe, it } from "node:test";
import { expect } from "@std/expect";
import {
  Equality,
  GreaterThan,
  GreaterThanOrEquals,
  Inequality,
  LessThan,
  LessThanOrEquals,
  Variable,
} from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { equals, gt, gte, lt, lte, nequals } from "./relational.ts";

describe("equals", () => {
  it("returns true for two equal reals", () => {
    expect(
      equals(real(1), real(1)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns true for two equal complexes", () => {
    expect(
      equals(complex(1, 1), complex(1, 1)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns true for two equal booleans", () => {
    expect(
      equals(boolean(false), boolean(false)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns false for unequal things", () => {
    expect(
      equals(real(1), real(2)),
    ).toEqual(
      boolean(false),
    );
  });

  it("is an Equality for unbound input", () => {
    expect(
      equals(variable("x"), variable("y")),
    ).toEqual(new Equality(new Variable("x"), new Variable("y")));
  });
});

describe("gt", () => {
  it("returns false for two ordered reals", () => {
    expect(
      gt(real(1), real(2)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns true for two unordered reals", () => {
    expect(
      gt(real(2), real(1)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns false for two equal inputs", () => {
    expect(
      gt(real(1), real(1)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns false for two complexes ordered by length", () => {
    expect(
      gt(complex(1, 1), complex(5, 5)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns true for two complexes not ordered by length", () => {
    expect(
      gt(complex(5, 5), complex(1, 1)),
    ).toEqual(
      boolean(true),
    );
  });

  it("is a GreaterThan for unbound input", () => {
    expect(
      gt(variable("x"), variable("y")),
    ).toEqual(new GreaterThan(new Variable("x"), new Variable("y")));
  });
});

describe("gte", () => {
  it("returns false for two ordered reals", () => {
    expect(
      gte(real(1), real(2)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns true for two unordered reals", () => {
    expect(
      gte(real(2), real(1)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns true for two equal inputs", () => {
    expect(
      gte(real(1), real(1)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns false for two complexes ordered by length", () => {
    expect(
      gte(complex(1, 1), complex(5, 5)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns true for two complexes not ordered by length", () => {
    expect(
      gte(complex(5, 5), complex(1, 1)),
    ).toEqual(
      boolean(true),
    );
  });

  it("is a GreaterThanOrEquals for unbound input", () => {
    expect(
      gte(variable("x"), variable("y")),
    ).toEqual(new GreaterThanOrEquals(new Variable("x"), new Variable("y")));
  });
});

describe("lt", () => {
  it("returns true for two ordered reals", () => {
    expect(lt(real(1), real(2))).toEqual(boolean(true));
  });

  it("returns false for two unordered reals", () => {
    expect(lt(real(2), real(1))).toEqual(boolean(false));
  });

  it("returns false for two equal inputs", () => {
    expect(lt(real(1), real(1))).toEqual(boolean(false));
  });

  it("returns true for two complexes ordered by length", () => {
    expect(
      lt(complex(1, 1), complex(5, 5)),
    ).toEqual(boolean(true));
  });

  it("returns false for two complexes not ordered by length", () => {
    expect(
      lt(complex(5, 5), complex(1, 1)),
    ).toEqual(boolean(false));
  });

  it("is a LessThan for unbound input", () => {
    expect(
      lt(variable("x"), variable("y")),
    ).toEqual(new LessThan(new Variable("x"), new Variable("y")));
  });
});

describe("lte", () => {
  it("returns true for two ordered reals", () => {
    expect(
      lte(real(1), real(2)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns false for two unordered reals", () => {
    expect(
      lte(real(2), real(1)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns true for two equal inputs", () => {
    expect(
      lte(real(1), real(1)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns true for two complexes ordered by length", () => {
    expect(
      lte(complex(1, 1), complex(5, 5)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns false for two complexes not ordered by length", () => {
    expect(
      lte(complex(5, 5), complex(1, 1)),
    ).toEqual(
      boolean(false),
    );
  });

  it("is a LessThanOrEquals for unbound input", () => {
    expect(
      lte(variable("x"), variable("y")),
    ).toEqual(new LessThanOrEquals(new Variable("x"), new Variable("y")));
  });
});

describe("nequals", () => {
  it("returns false for two equal reals", () => {
    expect(
      nequals(real(1), real(1)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns false for two equal complexes", () => {
    expect(
      nequals(complex(1, 1), complex(1, 1)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns false for two equal booleans", () => {
    expect(
      nequals(boolean(false), boolean(false)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns true for unequal things", () => {
    expect(
      nequals(real(1), real(2)),
    ).toEqual(
      boolean(true),
    );
  });

  it("is an Inequality for unbound input", () => {
    expect(
      nequals(variable("x"), variable("y")),
    ).toEqual(new Inequality(new Variable("x"), new Variable("y")));
  });
});
