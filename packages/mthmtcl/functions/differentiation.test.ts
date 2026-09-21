import { describe, it } from "node:test";
import { expect } from "@std/expect";
import {} from "../tree/mod.ts";
import { real } from "./real.ts";
import { complex } from "./complex.ts";
import { differentiate } from "./differentiation.ts";
import { variable } from "./variable.ts";
import { $add } from "./add.ts";
import { subtract } from "./subtract.ts";
import { multiply } from "./multiply.ts";
import { divide } from "./divide.ts";
import { negate } from "./negate.ts";
import { raise, reciprocal, sqrt, square } from "./raise.ts";
import { lb, lg, ln } from "./log.ts";
import { $abs } from "./absolute.ts";
import { cos, cot, csc, sec, sin, tan } from "./trigonometric.ts";
import { acos, acot, acsc, asec, asin, atan } from "./arcus.ts";
import { cosh, coth, csch, sech, sinh, tanh } from "./hyperbolic.ts";
import { acosh, acoth, acsch, asech, asinh, atanh } from "./areaHyperbolic.ts";

describe("differentiate", () => {
  describe("of reals", () => {
    it("is 0", () => {
      expect(differentiate(real(1))).toEqual(real(0));
    });
  });

  describe("of complex numbers", () => {
    it("is 0", () => {
      expect(differentiate(complex(1, 1))).toEqual(complex(0, 0));
    });
  });

  //   describe('of nil', () => {
  //     it('is NaN', () => {
  //       expect(differentiate(nil)).toEqual(nan)
  //     })
  //   })

  describe("of variables", () => {
    it("is 1 when unbound", () => {
      expect(differentiate(variable("x"))).toEqual(real(1));
    });
  });

  describe("of additions", () => {
    it("is the sum of the derivatives", () => {
      expect(differentiate($add(variable("x"), real(1)))).toEqual(real(1));
    });

    it("handles subtractions correctly", () => {
      expect(differentiate(subtract(real(1), variable("x")))).toEqual(real(-1));
    });
  });

  describe("of multiplications", () => {
    it("is the sum of the products of the derivatives of the parts", () => {
      expect(differentiate(multiply(real(2), variable("x")))).toEqual(real(2));
    });

    it("handles divisions correctly", () => {
      expect(differentiate(divide(real(5), variable("x")))).toEqual(
        divide(
          real(-5),
          square(variable("x")),
        ),
      );
    });

    it("returns the negation of derivative of the expression", () => {
      expect(differentiate(negate(variable("x")))).toEqual(real(-1));
    });
  });

  describe("of exponentiations", () => {
    it("returns the generalized power rule of the parts for powers", () => {
      expect(differentiate(square(variable("x")))).toEqual(
        multiply(real(2), variable("x")),
      );
    });

    it("returns the generalized power rule of the parts for exponentials", () => {
      expect(differentiate(raise(real(2), variable("x")))).toEqual(
        multiply(
          raise(real(2), variable("x")),
          ln(real(2)),
        ),
      );
    });
  });

  describe("of absolute values", () => {
    it("returns the chain rule of the derivative of the absolute", () => {
      expect(differentiate($abs(variable("x")))).toEqual(
        divide(variable("x"), $abs(variable("x"))),
      );
    });
  });

  describe("of logarithms", () => {
    it("is a chained derivative of the argument and a binary logarithm", () => {
      expect(differentiate(lb(variable("x")))).toEqual(
        divide(
          real(1),
          multiply(variable("x"), ln(real(2))),
        ),
      );
    });

    it("is a chained derivative of the argument and a natural logarithm", () => {
      expect(differentiate(ln(variable("x")))).toEqual(
        divide(
          real(1),
          variable("x"),
        ),
      );
    });

    it("is a chained derivative of the argument and a common logarithm", () => {
      expect(differentiate(lg(variable("x")))).toEqual(
        divide(
          real(1),
          multiply(variable("x"), ln(real(10))),
        ),
      );
    });
  });

  describe("of trigonometric functions", () => {
    it("returns the chain rule of the derivative of cosine of an expression", () => {
      expect(differentiate(cos(variable("x")))).toEqual(
        negate(sin(variable("x"))),
      );
    });

    it("returns the chain rule of the derivative of sine of an expression", () => {
      expect(differentiate(sin(variable("x")))).toEqual(
        cos(variable("x")),
      );
    });

    it("returns the chain rule of the derivative of tangent of an expression", () => {
      expect(differentiate(tan(variable("x")))).toEqual(
        square(sec(variable("x"))),
      );
    });

    it("returns the chain rule of the derivative of the secant", () => {
      expect(differentiate(sec(variable("x")))).toEqual(
        multiply(sec(variable("x")), tan(variable("x"))),
      );
    });

    it("returns the chain rule of the derivative of the cosecant", () => {
      expect(differentiate(csc(variable("x")))).toEqual(
        multiply(negate(csc(variable("x"))), cot(variable("x"))),
      );
    });

    it("returns the chain rule of the derivative of the cotangent", () => {
      expect(differentiate(cot(variable("x")))).toEqual(
        negate(square(csc(variable("x")))),
      );
    });
  });

  describe("of arcus functions", () => {
    it("returns the chain rule of the derivative of the acos", () => {
      expect(differentiate(acos(variable("x")))).toEqual(
        negate(reciprocal(sqrt(subtract(real(1), square(variable("x")))))),
      );
    });

    it("returns the chain rule of the derivative of the asin", () => {
      expect(differentiate(asin(variable("x")))).toEqual(
        reciprocal(sqrt(subtract(real(1), square(variable("x"))))),
      );
    });

    it("returns the chain rule of the derivative of the atan", () => {
      expect(differentiate(atan(variable("x")))).toEqual(
        reciprocal($add(real(1), square(variable("x")))),
      );
    });

    it("returns the chain rule of the derivative of the asec", () => {
      expect(differentiate(asec(variable("x")))).toEqual(
        reciprocal(multiply(
          $abs(variable("x")),
          sqrt(subtract(square(variable("x")), real(1))),
        )),
      );
    });

    it("returns the chain rule of the derivative of the acsc", () => {
      expect(differentiate(acsc(variable("x")))).toEqual(
        negate(reciprocal(multiply(
          $abs(variable("x")),
          sqrt(subtract(square(variable("x")), real(1))),
        ))),
      );
    });

    it("returns the chain rule of the derivative of the acot", () => {
      expect(differentiate(acot(variable("x")))).toEqual(
        negate(reciprocal($add(square(variable("x")), real(1)))),
      );
    });
  });

  describe("of hyperbolic functions", () => {
    it("returns the chain rule of the derivative of the cosh", () => {
      expect(differentiate(cosh(variable("x")))).toEqual(
        sinh(variable("x")),
      );
    });

    it("returns the chain rule of the derivative of the sinh", () => {
      expect(differentiate(sinh(variable("x")))).toEqual(
        cosh(variable("x")),
      );
    });

    it("returns the chain rule of the derivative of the tanh", () => {
      expect(differentiate(tanh(variable("x")))).toEqual(
        square(sech(variable("x"))),
      );
    });

    it("returns the chain rule of the derivative of the sech", () => {
      expect(differentiate(sech(variable("x")))).toEqual(
        multiply(
          negate(tanh(variable("x"))),
          sech(variable("x")),
        ),
      );
    });

    it("returns the chain rule of the derivative of the csch", () => {
      expect(differentiate(csch(variable("x")))).toEqual(
        multiply(
          negate(coth(variable("x"))),
          csch(variable("x")),
        ),
      );
    });

    it("returns the chain rule of the derivative of the coth", () => {
      expect(differentiate(coth(variable("x")))).toEqual(
        negate(square(csch(variable("x")))),
      );
    });
  });

  describe("of area hyperbolic functions", () => {
    it("returns the chain rule of the derivative of the acosh", () => {
      expect(differentiate(acosh(variable("x")))).toEqual(
        reciprocal(sqrt(subtract(square(variable("x")), real(1)))),
      );
    });

    it("returns the chain rule of the derivative of the asinh", () => {
      expect(differentiate(asinh(variable("x")))).toEqual(
        reciprocal(sqrt($add(real(1), square(variable("x"))))),
      );
    });

    it("returns the chain rule of the derivative of the atanh", () => {
      expect(differentiate(atanh(variable("x")))).toEqual(
        reciprocal(subtract(real(1), square(variable("x")))),
      );
    });

    it("returns the chain rule of the derivative of the asech", () => {
      expect(differentiate(asech(variable("x")))).toEqual(
        negate(reciprocal(multiply(
          variable("x"),
          sqrt(subtract(real(1), square(variable("x")))),
        ))),
      );
    });

    it("returns the chain rule of the derivative of the acsch", () => {
      expect(differentiate(acsch(variable("x")))).toEqual(
        negate(reciprocal(multiply(
          $abs(variable("x")),
          sqrt($add(real(1), square(variable("x")))),
        ))),
      );
    });

    it("returns the chain rule of the derivative of the acoth", () => {
      expect(differentiate(acoth(variable("x")))).toEqual(
        reciprocal(subtract(real(1), square(variable("x")))),
      );
    });
  });

  //   describe('of factorials', () => {
  //     it('returns the chain rule of the derivative of the factorial', () => {
  //       expect(
  //         differentiate(factorial(variable('x')))
  //       ).toEqual(
  //         multiply(factorial(variable('x')), digamma(add(variable('x'), real(1))))
  //       )
  //     })
  //   })

  //   describe('of gamma', () => {
  //     it('returns the chain rule of the derivative of gamma', () => {
  //       expect(
  //         differentiate(gamma(variable('x')))
  //       ).toEqual(
  //         multiply(gamma(variable('x')), digamma(variable('x')))
  //       )
  //     })
  //   })

  //   describe('of polygamma', () => {
  //     it('returns the chain rule of the derivative of the polygamma', () => {
  //       expect(
  //         differentiate(polygamma(variable('n'), variable('x')))
  //       ).toEqual(
  //         polygamma(add(variable('n'), real(1)), variable('x'))
  //       )
  //     })
  //   })

  //   describe('of derivatives', () => {
  //     it('returns the second derivative of the nested expression', () => {
  //       expect(differentiate(differentiate(cos(variable('x'))))).toEqual(
  //         negate(cos(variable('x')))
  //       )
  //     })
  //   })

  //   describe('of orders', () => {
  //     it('returns the nth derivative of an expression', () => {
  //       expect(differentiate(real(2), cos(variable('x')))).toEqual(
  //         negate(cos(variable('x')))
  //       )
  //     })
  //   })
});
