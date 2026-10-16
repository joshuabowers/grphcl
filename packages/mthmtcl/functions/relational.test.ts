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
import { cos } from "./trigonometric.ts";
import { acos } from "./arcus.ts";
import { cosh } from "./hyperbolic.ts";
import { acosh } from "./areaHyperbolic.ts";
import { add } from "./add.ts";
import { subtract } from "./subtract.ts";
import { multiply } from "./multiply.ts";
import { divide } from "./divide.ts";
import { negate } from "./negate.ts";
import { raise, reciprocal } from "./raise.ts";
import { log } from "./log.ts";
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
      equals(variable("y"), variable("x")),
    ).toEqual(new Equality(new Variable("y"), new Variable("x")));
  });

  it("discovers its variables and labels them", () => {
    const equality = equals(
      variable("y"),
      variable("x"),
    ) as unknown as Equality;
    expect(equality.variables).toEqual(new Set(["x", "y"]));
    expect(equality.dependent).toEqual("y");
    expect(equality.independent).toEqual(["x"]);
  });

  describe("isolation", () => {
    it("swaps right dependent with left independent", () => {
      expect(
        equals(variable("x"), variable("y")),
      ).toEqual(
        equals(variable("y"), variable("x")),
      );
      expect(
        equals(variable("x"), variable("y")),
      ).toBeInstanceOf(Equality);
    });

    it("inverts trig functions on a left dependent", () => {
      expect(
        equals(
          cos(variable("y")),
          variable("x"),
        ),
      ).toEqual(
        equals(
          variable("y"),
          acos(variable("x")),
        ),
      );
    });

    it("inverts hyperbolic functions on a left dependent", () => {
      expect(
        equals(
          cosh(variable("y")),
          variable("x"),
        ),
      ).toEqual(
        equals(
          variable("y"),
          acosh(variable("x")),
        ),
      );
    });

    it("inverts a left addition of dependent with subtraction", () => {
      expect(
        equals(
          add(variable("y"), real(5)),
          variable("x"),
        ),
      ).toEqual(
        equals(
          variable("y"),
          subtract(variable("x"), real(5)),
        ),
      );
    });

    it("inverts a left subtraction of dependent with addition", () => {
      expect(
        equals(
          subtract(variable("y"), real(5)),
          variable("x"),
        ),
      ).toEqual(
        equals(
          variable("y"),
          add(variable("x"), real(5)),
        ),
      );
    });

    it("inverts a left multiplication of dependent with division", () => {
      expect(
        equals(
          multiply(real(5), variable("y")),
          variable("x"),
        ),
      ).toEqual(
        equals(
          variable("y"),
          divide(variable("x"), real(5)),
        ),
      );
    });

    it("inverts a left numerator division of dependent with multiplication", () => {
      expect(
        equals(
          divide(variable("y"), real(5)),
          variable("x"),
        ),
      ).toEqual(
        equals(
          variable("y"),
          multiply(real(5), variable("x")),
        ),
      );
    });

    it("inverts a left denominator division with a multiplication", () => {
      expect(
        equals(
          divide(real(5), variable("y")),
          variable("x"),
        ),
      ).toEqual(
        // NB: While it might not seem like it, yes: this was
        //     achieved initially by a multiplication.
        equals(
          variable("y"),
          divide(real(5), variable("x")),
        ),
      );
    });

    it("inverts a left negation of dependent with negation", () => {
      expect(
        equals(
          negate(variable("y")),
          variable("x"),
        ),
      ).toEqual(
        equals(
          variable("y"),
          negate(variable("x")),
        ),
      );
    });

    it("inverts a left power exponentiation with a logarithm", () => {
      expect(
        equals(
          raise(real(2), variable("y")),
          variable("x"),
        ),
      ).toEqual(
        equals(
          variable("y"),
          log(real(2), variable("x")),
        ),
      );
    });

    it("inverts a left base exponentiation with a root", () => {
      expect(
        equals(
          raise(variable("y"), real(2)),
          variable("x"),
        ),
      ).toEqual(
        equals(
          variable("y"),
          raise(variable("x"), real(0.5)),
        ),
      );
    });

    it("inverts a left value logarithm with a exponentiation", () => {
      expect(
        equals(
          log(real(2), variable("y")),
          variable("x"),
        ),
      ).toEqual(
        equals(
          variable("y"),
          raise(real(2), variable("x")),
        ),
      );
    });

    it("inverts a left base logarithm with an root", () => {
      expect(
        equals(
          log(variable("y"), real(2)),
          variable("x"),
        ),
      ).toEqual(
        equals(
          variable("y"),
          raise(real(2), reciprocal(variable("x"))),
        ),
      );
    });

    it("inverts a right base logarithm with a root and reverses", () => {
      expect(
        equals(
          variable("x"),
          log(variable("y"), real(2)),
        ),
      ).toEqual(
        equals(
          variable("y"),
          raise(real(2), reciprocal(variable("x"))),
        ),
      );
    });

    it("inverts a right multiplication with a division", () => {
      expect(
        equals(
          variable("x"),
          multiply(real(5), variable("y")),
        ),
      ).toEqual(
        equals(
          variable("y"),
          divide(variable("x"), real(5)),
        ),
      );
    });

    it("inverts a right numerator division with a multiplication", () => {
      expect(
        equals(
          variable("x"),
          divide(variable("y"), real(5)),
        ),
      ).toEqual(
        equals(
          variable("y"),
          multiply(real(5), variable("x")),
        ),
      );
    });

    it("inverts a right denominator division with a multiplication", () => {
      expect(
        equals(
          variable("x"),
          divide(real(5), variable("y")),
        ),
      ).toEqual(
        // NB: While it might not seem like it, yes: this was
        //     achieved initially by a multiplication.
        equals(
          variable("y"),
          divide(real(5), variable("x")),
        ),
      );
    });

    it("correctly handles a complex invertable expression", () => {
      expect(
        equals(
          divide(raise(real(2), variable("y")), variable("x")),
          real(1024),
        ),
      ).toEqual(
        equals(
          variable("y"),
          log(real(2), multiply(real(1024), variable("x"))),
        ),
      );
    });
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
      gt(variable("y"), variable("x")),
    ).toEqual(new GreaterThan(new Variable("y"), new Variable("x")));
  });

  describe("isolation", () => {
    it("becomes a LessThan when left isolating right dependents", () => {
      expect(
        gt(variable("x"), variable("y")),
      ).toEqual(
        new LessThan(new Variable("y"), new Variable("x")),
      );
      expect(
        gt(variable("x"), variable("y")),
      ).toBeInstanceOf(LessThan);
    });
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
      gte(variable("y"), variable("x")),
    ).toEqual(new GreaterThanOrEquals(new Variable("y"), new Variable("x")));
  });

  describe("isolation", () => {
    it("becomes a LessThanOrEquals when left isolating right dependents", () => {
      expect(
        gte(variable("x"), variable("y")),
      ).toEqual(
        new LessThanOrEquals(new Variable("y"), new Variable("x")),
      );
      expect(
        gte(variable("x"), variable("y")),
      ).toBeInstanceOf(LessThanOrEquals);
    });
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
      lt(variable("y"), variable("x")),
    ).toEqual(new LessThan(new Variable("y"), new Variable("x")));
  });

  describe("isolation", () => {
    it("becomes a GreaterThan when left isolating right dependents", () => {
      expect(
        lt(variable("x"), variable("y")),
      ).toEqual(
        new GreaterThan(new Variable("y"), new Variable("x")),
      );

      expect(
        lt(variable("x"), variable("y")),
      ).toBeInstanceOf(GreaterThan);
    });
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
      lte(variable("y"), variable("x")),
    ).toEqual(new LessThanOrEquals(new Variable("y"), new Variable("x")));
  });

  describe("isolation", () => {
    it("becomes a GreaterThanOrEquals when left isolating right dependents", () => {
      expect(
        lte(variable("x"), variable("y")),
      ).toEqual(
        new GreaterThanOrEquals(new Variable("y"), new Variable("x")),
      );
      expect(
        lte(variable("x"), variable("y")),
      ).toBeInstanceOf(GreaterThanOrEquals);
    });
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
      nequals(variable("y"), variable("x")),
    ).toEqual(new Inequality(new Variable("y"), new Variable("x")));
  });

  describe("isolation", () => {
    it("swaps left independent and right dependent variables", () => {
      expect(
        nequals(variable("x"), variable("y")),
      ).toEqual(
        new Inequality(new Variable("y"), new Variable("x")),
      );
      expect(
        nequals(variable("x"), variable("y")),
      ).toBeInstanceOf(Inequality);
    });
  });
});
