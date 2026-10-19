import { method, type Multi, multi } from "@arrows/multimethod";
import { is } from "../factories/factory.ts";
import {
  Absolute,
  Addition,
  Exponentiation,
  Factorial,
  Gamma,
  Logarithm,
  Multiplication,
  Negation,
  Numeric,
  type TreeNode,
  UnaryNode,
  Variable,
} from "../tree/mod.ts";
import { differentiate } from "../functions/differentiation.ts";

export enum ChangeRates {
  Constant,
  Logarithmic,
  Linear,
  Polynomial,
  Cyclic,
  Exponential,
  SuperExponential,
  Unknown,
}

export interface ChangeRateFn extends Multi {
  (expression: TreeNode): ChangeRates;
}

export const changeRate: ChangeRateFn = multi(
  (expression: TreeNode) => {
    if (expression) {
      console.log("gR dispatch:");
      console.log("=> expression:", expression);
    }
    const result = differentiate(expression);
    if (expression) console.log("=> result:", result);
    return [result];
  },
  method([is(Numeric)], ChangeRates.Constant),
  method([is(Variable)], ChangeRates.Linear),
  method(
    [is(Addition)],
    (e: Addition) => Math.max(changeRate(e.left), changeRate(e.right)),
  ),
  method(
    [is(Multiplication)],
    (e: Multiplication) => Math.max(changeRate(e.left), changeRate(e.right)),
  ),
  method([is(Negation)], (e: Negation) => changeRate(e.child)),
  method([is(Absolute)], (e: Absolute) => changeRate(e.child)),
  method(
    [is(Exponentiation)],
    (e: Exponentiation) =>
      changeRate(e.right) === ChangeRates.Constant
        ? ChangeRates.Polynomial
        : ChangeRates.Exponential,
  ),
  method([is(Logarithm)], ChangeRates.Logarithmic),
  method([is(Factorial)], ChangeRates.SuperExponential),
  method([is(Gamma)], ChangeRates.SuperExponential),
  // NB: UnaryNodes past this point considered to be trig-like
  method([is(UnaryNode)], ChangeRates.Cyclic),
  method(ChangeRates.Unknown),
);
