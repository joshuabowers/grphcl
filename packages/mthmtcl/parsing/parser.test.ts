import { describe, it } from "node:test";
import { expect } from "@std/expect";
import {
  Absolute,
  Addition,
  AlternativeDenial,
  Arcus,
  AreaHyperbolic,
  Biconditional,
  Combination,
  Complement,
  Conjunction,
  ConverseImplication,
  Differentiation,
  Disjunction,
  Division,
  Equality,
  ExclusiveDisjunction,
  Exponentiation,
  Factorial,
  Gamma,
  GreaterThan,
  GreaterThanOrEquals,
  Hyperbolic,
  Implication,
  Inequality,
  Invocation,
  JointDenial,
  LessThan,
  LessThanOrEquals,
  Logarithm,
  Multiplication,
  Negation,
  Permutation,
  Polygamma,
  Subtraction,
  type TreeNode,
  Trigonometric,
} from "../tree/mod.ts";
import { boolean, complex, real, variable } from "../functions/mod.ts";
import { EulerMascheroni } from "../functions/real.ts";
import { type Entries, scope } from "../functions/variable.ts";
import { Unicode } from "./Unicode.ts";

import { parser } from "./parser.ts";

function parse(input: string, entries?: Entries): TreeNode {
  return parser.value(input, { context: scope(entries) });
}

describe("parser", () => {
  describe("of constants", () => {
    it("matches reals", () => {
      expect(parse("1.2345")).toEqual(real(1.2345));
    });

    it(`matches ${Unicode.e}`, () => {
      expect(parse(Unicode.e)).toEqual(real(Math.E));
    });

    it(`matches ${Unicode.pi}`, () => {
      expect(parse(Unicode.pi)).toEqual(real(Math.PI));
    });

    it(`matches ${Unicode.infinity}`, () => {
      expect(parse(Unicode.infinity)).toEqual(real(Infinity));
    });

    it(`matches ${Unicode.euler}`, () => {
      expect(parse(Unicode.euler)).toEqual(EulerMascheroni);
    });

    it("matches complex numbers", () => {
      expect(parse(`1.23 + 4.56${Unicode.i}`)).toEqual(complex(1.23, 4.56));
    });

    it("matches complex numbers with negative imaginary", () => {
      expect(parse(`1.23 - 4.56${Unicode.i}`)).toEqual(complex(1.23, -4.56));
    });

    it("matches complex numbers with negative real", () => {
      expect(parse(`-1.23 + 4.56${Unicode.i}`)).toEqual(complex(-1.23, 4.56));
    });

    it("matches negated imaginary numbers", () => {
      expect(parse(`-2${Unicode.i}`)).toEqual(complex(0, -2));
    });

    it(`matches ${Unicode.e}${Unicode.i}`, () => {
      expect(parse(`${Unicode.e}${Unicode.i}`)).toEqual(complex(0, Math.E));
    });

    it(`matches ${Unicode.pi}${Unicode.i}`, () => {
      expect(parse(`${Unicode.pi}${Unicode.i}`)).toEqual(complex(0, Math.PI));
    });

    // it("matches nil", () => {
    //   expect(parse("nil")).toEqual(nil);
    // });

    it("matches true", () => {
      expect(parse("true")).toEqual(boolean(true));
    });

    it("matches false", () => {
      expect(parse("false")).toEqual(boolean(false));
    });
  });

  describe("of variables", () => {
    it("matches identifiers", () => {
      expect(parse("x")).toEqual(variable("x"));
    });

    it("matches lowercase strings", () => {
      expect(parse("xyz")).toEqual(variable("xyz"));
    });

    it("matches uppercase strings", () => {
      expect(parse("XYZ")).toEqual(variable("XYZ"));
    });

    it("matches mixed case strings", () => {
      expect(parse("xYz")).toEqual(variable("xYz"));
    });

    it("matches intermixed digits", () => {
      expect(parse("x0")).toEqual(variable("x0"));
    });

    it("does not match leading digits", () => {
      expect(() => parser.value("0y")).toThrow();
    });

    it("matches leading underscores", () => {
      expect(parse("_x")).toEqual(variable("_x"));
    });

    it("matches intermixed underscores", () => {
      expect(parse("x_")).toEqual(variable("x_"));
    });

    it("matches theta", () => {
      expect(parse(Unicode.theta)).toEqual(variable(Unicode.theta));
    });

    it("matches leading theta", () => {
      expect(parse(`${Unicode.theta}x`)).toEqual(variable(`${Unicode.theta}x`));
    });

    it("matches intermixed theta", () => {
      expect(parse(`x${Unicode.theta}`)).toEqual(variable(`x${Unicode.theta}`));
    });

    it("does not match reserved words", () => {
      expect(() => parser.value("cos")).toThrow();
    });

    // it("returns the value of the variable if present in scope", () => {
    //   const s = scope();
    //   s.set("x", variable("x", real(5)));
    //   expectInScope(s, "x", variable("x", real(5)));
    // });

    // it("returns an unbound variable if set to nil", () => {
    //   const s = scope();
    //   s.set("x", variable("x", nil));
    //   expect("x", variable("x"), s);
    // });
  });

  describe("of additions", () => {
    it("matches a simple binary", () => {
      expect(
        parse("1.23 + 4.56"),
      ).toEqual(
        new Addition(real(1.23), real(4.56)),
      );
    });

    it("matches nested additions left associatively", () => {
      expect(
        parse("1.23 + 4.56 + 7.89"),
      ).toEqual(
        new Addition(
          new Addition(real(1.23), real(4.56)),
          real(7.89),
        ),
      );
    });
  });

  describe("of subtractions", () => {
    it("matches a simple binary", () => {
      expect(parse("1 - 2")).toEqual(new Subtraction(real(1), real(2)));
    });

    it("matches nested subtractions left associatively", () => {
      expect(
        parse("1 - 2 - 3"),
      ).toEqual(
        new Subtraction(
          new Subtraction(real(1), real(2)),
          real(3),
        ),
      );
    });

    it("matches mixed addition and subtraction", () => {
      expect(
        parse("1 + 2 - 3"),
      ).toEqual(
        new Subtraction(
          new Addition(real(1), real(2)),
          real(3),
        ),
      );
    });

    // it('matches an alternative symbol for subtraction', () => {
    //   expect(`1 ${Unicode.minus} 2`, subtract(real(1), real(2)))
    // })
  });

  describe("of multiplications", () => {
    it("matches a simple binary", () => {
      expect(parse("1 * 2")).toEqual(new Multiplication(real(1), real(2)));
    });

    it("matches nested multiplications left associatively", () => {
      expect(
        parse("1 * 2 * 3"),
      ).toEqual(
        new Multiplication(
          new Multiplication(real(1), real(2)),
          real(3),
        ),
      );
    });

    it("has a higher precedence for multiplication over addition", () => {
      expect(
        parse("2 * 3 + 4 * 5"),
      ).toEqual(
        new Addition(
          new Multiplication(real(2), real(3)),
          new Multiplication(real(4), real(5)),
        ),
      );
    });

    // it('matches an alternative symbol for multiplication', () => {
    //   expect(`2 ${Unicode.multiplication} 3`, multiply(real(2), real(3)))
    // })
  });

  describe("of divisions", () => {
    it("matches a simple binary", () => {
      expect(parse("1 / 2")).toEqual(new Division(real(1), real(2)));
    });

    it("matches nested divisions left associatively", () => {
      expect(
        parse("1 / 2 / 3"),
      ).toEqual(
        new Division(
          new Division(real(1), real(2)),
          real(3),
        ),
      );
    });

    it("has a higher precedence for division over addition", () => {
      expect(
        parse("1 / 2 + 3 / 4"),
      ).toEqual(
        new Addition(
          new Division(real(1), real(2)),
          new Division(real(3), real(4)),
        ),
      );
    });

    it("has equal precedence to multiplication", () => {
      expect(
        parse("1 / 2 * 3"),
      ).toEqual(
        new Multiplication(
          new Division(real(1), real(2)),
          real(3),
        ),
      );
      expect(
        parse("1 * 2 / 3"),
      ).toEqual(
        new Division(
          new Multiplication(real(1), real(2)),
          real(3),
        ),
      );
    });

    // it('matches an alternative symbol for division', () => {
    //   expect(`1 ${Unicode.division} 2`, divide(real(1), real(2)))
    // })
  });

  describe("of exponentiations", () => {
    it("matches a simple binary", () => {
      expect(parse("1 ** 2")).toEqual(new Exponentiation(real(1), real(2)));
    });

    it("matches nested exponentiations right recursively", () => {
      expect(
        parse("1 ** 2 ** 3"),
      ).toEqual(
        new Exponentiation(
          real(1),
          new Exponentiation(real(2), real(3)),
        ),
      );
    });

    it("matches a square root shorthand", () => {
      expect(
        parse(`${Unicode.squareRoot}(x)`),
      ).toEqual(new Exponentiation(variable("x"), real(0.5)));
    });
  });

  describe("of grouping parentheses", () => {
    it("matches the inner expression", () => {
      expect(parse("(1 + 2)")).toEqual(new Addition(real(1), real(2)));
    });

    it("influences associativity", () => {
      expect(
        parse("1 + (2 + 3)"),
      ).toEqual(
        new Addition(
          real(1),
          new Addition(real(2), real(3)),
        ),
      );
    });

    it("matches brackets", () => {
      expect(parse("[1 + 2]")).toEqual(new Addition(real(1), real(2)));
    });

    it("matches braces", () => {
      expect(parse("{1 + 2}")).toEqual(new Addition(real(1), real(2)));
    });

    it("matches nested different forms", () => {
      expect(parse("2 * (27 ** [4 / {6 * 2}])")).toEqual(
        new Multiplication(
          real(2),
          new Exponentiation(
            real(27),
            new Division(
              real(4),
              new Multiplication(
                real(6),
                real(2),
              ),
            ),
          ),
        ),
      );
    });
  });

  describe("of negations", () => {
    it("matches a basic negation", () => {
      expect(parse("-1")).toEqual(new Negation(real(1)));
    });

    it("matches nested negations", () => {
      expect(parse("--1")).toEqual(new Negation(new Negation(real(1))));
    });

    it("matches negations of complex numbers", () => {
      expect(parse(`-(-1 - ${Unicode.i})`)).toEqual(
        new Negation(complex(-1, -1)),
      );
    });

    // it("matches an alternative symbol for negations", () => {
    //   expect(parse(`${Unicode.minus}1`)).toEqual(new Negation(real(1)));
    // });
  });

  describe("of absolute values", () => {
    it("matches a basic absolute", () => {
      expect(parse("abs(-x)")).toEqual(
        new Absolute(new Negation(variable("x"))),
      );
    });
  });

  describe("of logarithms", () => {
    it("matches the binary logarithm", () => {
      expect(parse("lb(x)")).toEqual(new Logarithm(real(2), variable("x")));
    });

    it("matches the natural logarithm", () => {
      expect(parse("ln(x)")).toEqual(
        new Logarithm(real(Math.E), variable("x")),
      );
    });

    it("matches the common logarithm", () => {
      expect(parse("lg(x)")).toEqual(new Logarithm(real(10), variable("x")));
    });

    it("matches arbitrary logarithms", () => {
      expect(parse("log(x, y)")).toEqual(
        new Logarithm(variable("x"), variable("y")),
      );
    });
  });

  describe("of trigonometric functions", () => {
    it("matches cosines", () => {
      expect(parse("cos(x)")).toEqual(new Trigonometric.Cosine(variable("x")));
    });

    it("matches sines", () => {
      expect(parse("sin(x)")).toEqual(new Trigonometric.Sine(variable("x")));
    });

    it("matches tangents", () => {
      expect(parse("tan(x)")).toEqual(new Trigonometric.Tangent(variable("x")));
    });

    it("matches secants", () => {
      expect(parse("sec(x)")).toEqual(new Trigonometric.Secant(variable("x")));
    });

    it("matches cosecants", () => {
      expect(parse("csc(x)")).toEqual(
        new Trigonometric.Cosecant(variable("x")),
      );
    });

    it("matches cotangents", () => {
      expect(parse("cot(x)")).toEqual(
        new Trigonometric.Cotangent(variable("x")),
      );
    });
  });

  describe("of arcus functions", () => {
    it("matches arcus cosines", () => {
      expect(parse("acos(x)")).toEqual(new Arcus.Cosine(variable("x")));
    });

    it("matches arcus sines", () => {
      expect(parse("asin(x)")).toEqual(new Arcus.Sine(variable("x")));
    });

    it("matches arcus tangents", () => {
      expect(parse("atan(x)")).toEqual(new Arcus.Tangent(variable("x")));
    });

    it("matches arcus secants", () => {
      expect(parse("asec(x)")).toEqual(new Arcus.Secant(variable("x")));
    });

    it("matches arcus cosecants", () => {
      expect(parse("acsc(x)")).toEqual(new Arcus.Cosecant(variable("x")));
    });

    it("matches arcus cotangents", () => {
      expect(parse("acot(x)")).toEqual(new Arcus.Cotangent(variable("x")));
    });
  });

  describe("of hyperbolic functions", () => {
    it("matches hyperbolic cosines", () => {
      expect(parse("cosh(x)")).toEqual(new Hyperbolic.Cosine(variable("x")));
    });

    it("matches hyperbolic sines", () => {
      expect(parse("sinh(x)")).toEqual(new Hyperbolic.Sine(variable("x")));
    });

    it("matches hyperbolic tangents", () => {
      expect(parse("tanh(x)")).toEqual(new Hyperbolic.Tangent(variable("x")));
    });

    it("matches hyperbolic secants", () => {
      expect(parse("sech(x)")).toEqual(new Hyperbolic.Secant(variable("x")));
    });

    it("matches hyperbolic cosecants", () => {
      expect(parse("csch(x)")).toEqual(new Hyperbolic.Cosecant(variable("x")));
    });

    it("matches hyperbolic cotangents", () => {
      expect(parse("coth(x)")).toEqual(new Hyperbolic.Cotangent(variable("x")));
    });
  });

  describe("of area hyperbolic functions", () => {
    it("matches area hyperbolic cosines", () => {
      expect(parse("acosh(x)")).toEqual(
        new AreaHyperbolic.Cosine(variable("x")),
      );
    });

    it("matches area hyperbolic sines", () => {
      expect(parse("asinh(x)")).toEqual(new AreaHyperbolic.Sine(variable("x")));
    });

    it("matches area hyperbolic tangents", () => {
      expect(parse("atanh(x)")).toEqual(
        new AreaHyperbolic.Tangent(variable("x")),
      );
    });

    it("matches area hyperbolic secants", () => {
      expect(parse("asech(x)")).toEqual(
        new AreaHyperbolic.Secant(variable("x")),
      );
    });

    it("matches area hyperbolic cosecants", () => {
      expect(parse("acsch(x)")).toEqual(
        new AreaHyperbolic.Cosecant(variable("x")),
      );
    });

    it("matches area hyperbolic cotangents", () => {
      expect(parse("acoth(x)")).toEqual(
        new AreaHyperbolic.Cotangent(variable("x")),
      );
    });
  });

  describe("of factorial-likes", () => {
    it("matches factorial functions", () => {
      expect(parse("x!")).toEqual(new Factorial(variable("x")));
    });

    it("matches nested factorials", () => {
      expect(parse("x!!")).toEqual(new Factorial(new Factorial(variable("x"))));
    });

    it("matches gamma", () => {
      expect(parse(`${Unicode.gamma}(x)`)).toEqual(new Gamma(variable("x")));
    });

    it("matches digamma", () => {
      expect(parse(`${Unicode.digamma}(x)`)).toEqual(
        new Polygamma(real(0), variable("x")),
      );
    });

    it("matches polygamma", () => {
      expect(
        parse(`${Unicode.digamma}(1, x)`),
      ).toEqual(
        new Polygamma(real(1), variable("x")),
      );
    });

    it("matches polygamma with non-real order", () => {
      expect(
        parse(`${Unicode.digamma}(n, x)`),
      ).toEqual(
        new Polygamma(variable("n"), variable("x")),
      );
    });
  });

  describe("of combinatorics", () => {
    it("matches permutations", () => {
      expect(parse("P(n, r)")).toEqual(
        new Permutation(variable("n"), variable("r")),
      );
    });

    it("matches combinations", () => {
      expect(parse("C(n, r)")).toEqual(
        new Combination(variable("n"), variable("r")),
      );
    });
  });

  describe("of functions", () => {
    it("matches nested composition", () => {
      expect(
        parse("cos(ln(tan(x)))"),
      ).toEqual(
        new Trigonometric.Cosine(
          new Logarithm(
            real(Math.E),
            new Trigonometric.Tangent(variable("x")),
          ),
        ),
      );
    });
  });

  describe("of derivatives", () => {
    it("matches a basic derivative", () => {
      expect(
        parse(`${Unicode.derivative}(x)`),
      ).toEqual(new Differentiation(variable("x")));
    });

    it("matches nested derivatives", () => {
      expect(
        parse(`${Unicode.derivative}(${Unicode.derivative}(x))`),
      ).toEqual(
        new Differentiation(new Differentiation(variable("x"))),
      );
    });

    it("matches a derivative order", () => {
      expect(
        parse(`${Unicode.derivative}(2, x**2)`),
      ).toEqual(
        new Differentiation(
          new Exponentiation(variable("x"), real(2)),
          real(2),
        ),
      );
    });
  });

  //   describe("of assignments", () => {
  //     it("matches a basic assignment", () => {
  //       expectInScope(scope(), "x := 2", variable("x", real(2)));
  //     });

  //     it("matches the assignment of a variable expression", () => {
  //       expectInScope(
  //         scope(),
  //         "y := 2 * x**2",
  //         variable("y", double(square(variable("x")))),
  //         variable("x"),
  //       );
  //     });

  //     it("matches assignments right-associatively", () => {
  //       expectInScope(
  //         scope(),
  //         "z := y := x",
  //         variable("z", variable("x")),
  //         variable("y", variable("x")),
  //         variable("x"),
  //       );
  //     });

  //     it("matches assignments of nil by unsetting variable", () => {
  //       expectInScope(scope(), "x := nil", variable("x", nil));
  //     });

  //     it("assigns the value of the expression automatically to Ans", () => {
  //       // NOTE: multiplication used to ensure proper log information is
  //       // added to the Writer for comparison against the actual result.
  //       // Otherwise, would have to ignore log info on variable comparisons.
  //       expectInScope(
  //         scope(),
  //         "2 * 5",
  //         variable("Ans", new Multiplication(real(2), real(5))),
  //       );
  //     });
  //   });

  describe("of invocations", () => {
    it("matches a basic invocation", () => {
      expect(parse("x(2)")).toEqual(new Invocation(variable("x"), real(2)));
    });

    it("allows multiple arguments to be passed", () => {
      expect(parse("x(2, y, 4)")).toEqual(
        new Invocation(
          variable("x"),
          real(2),
          variable("y"),
          real(4),
        ),
      );
    });

    it("can invoke a parenthetical", () => {
      expect(
        parse("(x**2 + x)(5)"),
      ).toEqual(
        new Invocation(
          new Addition(
            new Exponentiation(
              variable("x"),
              real(2),
            ),
            variable("x"),
          ),
          real(5),
        ),
      );
    });

    it("can invoke a derivative", () => {
      expect(
        parse(`${Unicode.derivative}(x**2)(5)`),
      ).toEqual(
        new Invocation(
          new Differentiation(
            new Exponentiation(
              variable("x"),
              real(2),
            ),
          ),
          real(5),
        ),
      );
    });

    it("can recursively invoke", () => {
      expect(
        parse("(x + y * z)(1)(2)(3)"),
      ).toEqual(
        new Invocation(
          new Invocation(
            new Invocation(
              new Addition(
                variable("x"),
                new Multiplication(
                  variable("y"),
                  variable("z"),
                ),
              ),
              real(1),
            ),
            real(2),
          ),
          real(3),
        ),
      );
    });

    it("recursively associates correctly", () => {
      expect(
        parse("(x*2)(y+3)(1)"),
      ).toEqual(
        new Invocation(
          new Invocation(
            new Multiplication(
              variable("x"),
              real(2),
            ),
            new Addition(
              variable("y"),
              real(3),
            ),
          ),
          real(1),
        ),
      );
    });
  });

  describe("of logical operations", () => {
    it("matches the logical complement of false", () => {
      expect(
        parse(`${Unicode.not}false`),
      ).toEqual(new Complement(boolean(false)));
    });

    it("matches the logical complement of true", () => {
      expect(
        parse(`${Unicode.not}true`),
      ).toEqual(new Complement(boolean(true)));
    });

    it("matches strict equalities", () => {
      expect(parse("1 == 2")).toEqual(
        new Equality(real(1), real(2)),
      );
    });

    it("matches strict inequalities", () => {
      expect(parse("1 != 2")).toEqual(
        new Inequality(real(1), real(2)),
      );
    });

    it("matches less than inequalities", () => {
      expect(parse("1 < 2")).toEqual(
        new LessThan(real(1), real(2)),
      );
    });

    it("matches greater than inequalities", () => {
      expect(parse("1 > 2")).toEqual(
        new GreaterThan(real(1), real(2)),
      );
    });

    it("matches less than equals inequalities", () => {
      expect(parse("1 <= 2")).toEqual(
        new LessThanOrEquals(real(1), real(2)),
      );
    });

    it("matches greater than equals inequalities", () => {
      expect(parse("1 >= 2")).toEqual(
        new GreaterThanOrEquals(real(1), real(2)),
      );
    });

    it("matches inequalities with lower precedence than arithmetic", () => {
      expect(
        parse("1 + 2 > x + 4"),
      ).toEqual(
        new GreaterThan(
          new Addition(real(1), real(2)),
          new Addition(variable("x"), real(4)),
        ),
      );
    });

    // it("matches inequalities with higher precedence than assignments", () => {
    //   expectInScope(
    //     scope(),
    //     "y := x < 10",
    //     variable("y", lessThan(variable("x"), real(10))),
    //   );
    // });

    it("matches inequalities with left associativity", () => {
      expect(
        parse("1 < x < 5"),
      ).toEqual(
        new LessThan(
          new LessThan(real(1), variable("x")),
          real(5),
        ),
      );
    });
  });

  describe("of logical connectives", () => {
    it("matches conjunctions", () => {
      expect(
        parse(`true ${Unicode.and} false`),
      ).toEqual(
        new Conjunction(
          boolean(true),
          boolean(false),
        ),
      );
    });

    it("matches disjunctions", () => {
      expect(
        parse(`true ${Unicode.or} false`),
      ).toEqual(
        new Disjunction(
          boolean(true),
          boolean(false),
        ),
      );
    });

    it("matches exclusive disjunctions", () => {
      expect(
        parse(`true ${Unicode.xor} false`),
      ).toEqual(
        new ExclusiveDisjunction(
          boolean(true),
          boolean(false),
        ),
      );
    });

    it("matches implications", () => {
      expect(
        parse(`true ${Unicode.implies} false`),
      ).toEqual(
        new Implication(
          boolean(true),
          boolean(false),
        ),
      );
    });

    it("matches alternative denials", () => {
      expect(
        parse(`true ${Unicode.nand} false`),
      ).toEqual(
        new AlternativeDenial(
          boolean(true),
          boolean(false),
        ),
      );
    });

    it("matches joint denials", () => {
      expect(
        parse(`true ${Unicode.nor} false`),
      ).toEqual(
        new JointDenial(
          boolean(true),
          boolean(false),
        ),
      );
    });

    it("matches biconditionals", () => {
      expect(
        parse(`true ${Unicode.xnor} false`),
      ).toEqual(
        new Biconditional(
          boolean(true),
          boolean(false),
        ),
      );
    });

    it("matches converse implications", () => {
      expect(
        parse(`true ${Unicode.converse} false`),
      ).toEqual(
        new ConverseImplication(
          boolean(true),
          boolean(false),
        ),
      );
    });

    // it("matches connectives with greater precedence than assignment", () => {
    //   // NOTE: using the 'or' function to generate log information for
    //   // the Writer for the value bound to the variable.
    //   expectInScope(
    //     scope(),
    //     `y := false ${Unicode.or} true`,
    //     variable("y", or(boolean(false), boolean(true))),
    //   );
    // });

    it("matches connectives with lower precedence than inequalities", () => {
      expect(
        parse(`x <= 5 ${Unicode.and} x > -5`),
      ).toEqual(
        new Conjunction(
          new LessThanOrEquals(variable("x"), real(5)),
          new GreaterThan(variable("x"), new Negation(real(5))),
        ),
      );
    });
  });
});
