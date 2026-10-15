import {
  Addition,
  Arcus,
  AreaHyperbolic,
  BinaryNode,
  Division,
  Hyperbolic,
  Multiplication,
  type Relation,
  Subtraction,
  type TreeNode,
  Trigonometric,
  UnaryNode,
  Variable,
} from "../tree/mod.ts";
import { method, type Multi, multi } from "@arrows/multimethod";
import {
  Action,
  type Constructor,
  type Context,
  is,
  type MathFn,
  type Predicate,
  type When,
} from "../factories/factory.ts";
import { otherwise } from "../factories/binary.ts";
import { parameterize } from "./parameterization.ts";
import { add } from "../functions/add.ts";
import { subtract } from "../functions/subtract.ts";
import { multiply } from "../functions/multiply.ts";
import { divide } from "../functions/divide.ts";
import { cos, cot, csc, sec, sin, tan } from "../functions/trigonometric.ts";
import { acos, acot, acsc, asec, asin, atan } from "../functions/arcus.ts";
import { cosh, coth, csch, sech, sinh, tanh } from "../functions/hyperbolic.ts";
import {
  acosh,
  acoth,
  acsch,
  asech,
  asinh,
  atanh,
} from "../functions/areaHyperbolic.ts";

const left = <L, R>(l: L, _r: R) => l;
const right = <L, R>(_l: L, r: R) => r;

export interface SadmepFn extends Multi {
  (left: TreeNode, right: TreeNode): TreeNode;
}

/**
 * Returns whichever of its parameters that has higher precedence
 * under SADMEP.
 */
export const sadmep: SadmepFn = multi(
  method([is(Subtraction), is(Subtraction)], left),
  method([is(Subtraction), is(Addition)], left),
  //
  method([is(Addition), is(Subtraction)], left),
  method([is(Division), is(Subtraction)], right),
);

const when = <I extends TreeNode, O extends UnaryNode | BinaryNode>(
  predicate: Predicate<I>,
  rewrite: MathFn<O>,
) => method(predicate, (_e: I) => rewrite);

export interface InverseFn extends Multi {
  (expression: TreeNode): MathFn<UnaryNode | BinaryNode>;
}

export const inverse: InverseFn = multi(
  when(is(Addition), subtract),
  when(is(Subtraction), add),
  when(is(Multiplication), divide),
  when(is(Division), multiply),
  when(is(Trigonometric.Cosine), acos),
  when(is(Trigonometric.Sine), asin),
  when(is(Trigonometric.Tangent), atan),
  when(is(Trigonometric.Secant), asec),
  when(is(Trigonometric.Cosecant), acsc),
  when(is(Trigonometric.Cotangent), acot),
  when(is(Arcus.Cosine), cos),
  when(is(Arcus.Sine), sin),
  when(is(Arcus.Tangent), tan),
  when(is(Arcus.Secant), sec),
  when(is(Arcus.Cosecant), csc),
  when(is(Arcus.Cotangent), cot),
  when(is(Hyperbolic.Cosine), acosh),
  when(is(Hyperbolic.Sine), asinh),
  when(is(Hyperbolic.Tangent), atanh),
  when(is(Hyperbolic.Secant), asech),
  when(is(Hyperbolic.Cosecant), acsch),
  when(is(Hyperbolic.Cotangent), acoth),
  when(is(AreaHyperbolic.Cosine), cosh),
  when(is(AreaHyperbolic.Sine), sinh),
  when(is(AreaHyperbolic.Tangent), tanh),
  when(is(AreaHyperbolic.Secant), sech),
  when(is(AreaHyperbolic.Cosecant), csch),
  when(is(AreaHyperbolic.Cotangent), coth),
);

export function $isolate<R extends Relation>(
  ctor: Constructor<R>,
): When<Context.Otherwise> {
  return otherwise((l, r) => {
    let left = l, right = r;
    const lVars = parameterize(l);
    let rVars = parameterize(r);
    let action: Action = Action.Creation;
    const dep = [...lVars.keys(), ...rVars.keys()].sort().at(-1);

    if (!dep) {
      throw new Error("isolate: could not determine dependent variable");
    }

    const isDepIsolated = is(Variable, (v) => v.name === dep);
    const isUnary = is(UnaryNode);
    const isBinary = is(BinaryNode);

    while (!isDepIsolated(left) && rVars.has(dep)) {
      // 1. Determine which side has precedence based on SADMEP
      //    (return that side)
      // NB: if left already dep variable, only look at right.
      const child = isDepIsolated(left) ? right : sadmep(left, right);

      // 2. Given side (from 1), determine inverse operation via map/lookup
      if (isUnary(child)) {
        const fn = inverse(child);

        // 3. Apply (2) to left & right, setting same to inverted;
        left = fn(left);
        right = fn(right);
      } else if (isBinary(child)) {
        // 3. Apply (2) to left & right, setting same to inverted;
        // NB: Needs to find operand to apply to both!

        /**
         * consider: x + y == 5 * x
         * sadmep => left => child
         * child is binary
         * child === left
         */

        const fn = inverse(child);
        let operand: TreeNode | undefined;
        const glVars = parameterize(child.left),
          grVars = parameterize(child.right);
        if (child === left) {
          // first child of child which does not contain dep, or child
          operand = !glVars.has(dep)
            ? child.left
            : !grVars.has(dep)
            ? child.right
            : child;
        } else {
          // first child of child when does contain dep, or child
          operand = glVars.has(dep)
            ? child.left
            : grVars.has(dep)
            ? child.right
            : child;
        }
        // const operand: TreeNode = undefined;
        left = fn(left, operand);
        right = fn(right, operand);
      } else {
        throw new Error("isolate: unhandled");
      }

      // 4. recalculate rVars
      rVars = parameterize(right);

      action = Action.Canonicalization;
    }

    return [new ctor(left, right), action];
  });
}
