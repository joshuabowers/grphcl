import {
  Addition,
  Arcus,
  AreaHyperbolic,
  BinaryNode,
  Division,
  Exponentiation,
  Hyperbolic,
  Logarithm,
  Multiplication,
  Negation,
  type Relation,
  Subtraction,
  type TreeNode,
  Trigonometric,
  UnaryNode,
  Variable,
} from "../tree/mod.ts";
import { _, method, type Multi, multi } from "@arrows/multimethod";
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
import { negate } from "../functions/negate.ts";
import { raise, reciprocal } from "../functions/raise.ts";
import { log } from "../functions/log.ts";
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
  method([is(Variable), _], left),
  //
  method([is(Subtraction), _], left),
  method([is(Addition), _], left),
  //
  method([_, is(Subtraction)], right),
  method([_, is(Addition)], right),
  //
  method([is(Division), _], left),
  method([is(Multiplication), _], left),
  //
  method([_, is(Division)], right),
  method([_, is(Multiplication)], right),
  //
  method([is(Exponentiation), _], left),
  method([_, is(Exponentiation)], right),
  //
  method(left),
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
  when(is(Negation), negate),
  when(is(Exponentiation), log),
  when(is(Logarithm), raise),
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

export function isolate<R extends Relation>(
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

    console.log("isolate:");
    console.log("left:", left);
    console.log("right:", right);
    console.log("lVars:", lVars);
    console.log("rVars:", rVars);
    console.log("=> dep:", dep);

    const isDepIsolated = is(Variable, (v) => v.name === dep);
    const isUnary = is(UnaryNode);
    const isBinary = is(BinaryNode);
    const isVariable = is(Variable);

    console.log("isDepIsolated(left):", isDepIsolated(left));
    console.log("rVars.has(dep):", rVars.has(dep));

    console.log("BEGIN LOOP");

    while (!isDepIsolated(left) || rVars.has(dep)) {
      // 1. Determine which side has precedence based on SADMEP
      //    (return that side)
      // NB: if left already dep variable, only look at right.
      //     Also: if the right is dep isolated, as it needs
      //     rearrangement.
      const child = !rVars.has(dep)
        ? left
        : isDepIsolated(left) || isDepIsolated(right)
        ? right
        : sadmep(left, right);

      console.log("=> child:", child);

      // 2. Given side (from 1), determine inverse operation via map/lookup
      if (isUnary(child)) {
        const fn = inverse(child);

        // 3. Apply (2) to left & right, setting same to inverted;
        left = fn(left);
        right = fn(right);
      } else if (isBinary(child)) {
        // 3. Apply (2) to left & right, setting same to inverted;
        // NB: Needs to find operand to apply to both!

        let operand: TreeNode | undefined;
        const glVars = parameterize(child.left),
          grVars = parameterize(child.right);

        if (child instanceof Exponentiation) {
          if (glVars.has(dep)) {
            // i.e.: y**2
            // NB!!!!: Principal branch; needs multivalue function!
            left = raise(left, reciprocal(child.right));
            right = raise(right, reciprocal(child.right));
          } else if (grVars.has(dep)) {
            // i.e.: 2**y
            left = log(child.left, left);
            right = log(child.left, right);
          } else {
            throw new Error("isolate: confused about an Exponentiation");
          }
        } else if (child instanceof Logarithm) {
          if (glVars.has(dep)) {
            // i.e.: log(y, 2) == x <-> y == 2 ** (1/x)
            console.log("child is logarithm with dep-valued base");
            const base = child.right, childIsLeft = child === left;
            left = childIsLeft ? child.left : raise(base, reciprocal(left));
            right = childIsLeft ? raise(base, reciprocal(right)) : child.left;
          } else if (grVars.has(dep)) {
            // i.e.: log(2, y) == x
            left = raise(child.left, left);
            right = raise(child.left, right);
          } else {
            throw new Error("isolate: confused about a Logarithm");
          }
        } else if (child instanceof Addition) {
          if (child === left) {
            // x + y == 0 <-> subtract x -- pre-sorted by grevlex
            left = subtract(left, glVars.has(dep) ? child.right : child.left);
            right = subtract(right, glVars.has(dep) ? child.right : child.left);
          } else {
            // 0 == x + y <-> subtract y -- pre-sorted by grevlex
            left = subtract(left, grVars.has(dep) ? child.left : child.right);
            right = subtract(right, grVars.has(dep) ? child.left : child.right);
          }
        } else if (child instanceof Subtraction) {
          // Motivation cases:
          // y - x == 0 <-> add x
          // x - y == 0 <-> subtract x
          // 0 == y - x <-> subtract y
          // 0 == x - y <-> add y
          // Despite the different addends/subtractands, the
          // *positions* of operand is the same! The four
          // edge cases can be reduced to the following biconditional
          // which checks for dep being leftmost or rightmost wrt
          // the grandchildren.
          const { left: gl, right: gr } = child;
          const depLeftmostXnorRightmost =
            (child === left && glVars.has(dep)) ||
            (child === right && grVars.has(dep));
          left = depLeftmostXnorRightmost ? add(left, gr) : subtract(left, gl);
          right = depLeftmostXnorRightmost
            ? add(right, gr)
            : subtract(right, gl);
        } else if (child instanceof Multiplication) {
          // x * y == 1 <-> divide by x -- pre-sorted by monolex
          // 1 == x * y <-> divide by x -- pre-sorted by monolex
          // NB: while the second case *could* be solved by
          //     dividing by y, x is more consistent, easier to
          //     manage, and results in separate but equivalent
          //     rearrangement pathways.
          operand = glVars.has(dep) ? child.right : child.left;
          left = divide(left, operand);
          right = divide(right, operand);
        } else if (child instanceof Division) {
          // y / x == 1 <-> multiply by x
          // x / y == 1 <-> multiply by y
          // 1 == y / x <-> multiply by x
          // 1 == x / y <-> multiply by y
          const denominator = child.right;
          left = multiply(left, denominator);
          right = multiply(right, denominator);
        }
      } else if (isVariable(child)) {
        left = subtract(left, child);
        right = subtract(right, child);
      } else {
        throw new Error("isolate: unhandled");
      }

      // 4. recalculate rVars
      rVars = parameterize(right);

      console.log("=> left:", left);
      console.log("=> right:", right);
      console.log("isDepIsolated(left):", isDepIsolated(left));
      console.log("rVars.has(dep):", rVars.has(dep));

      action = Action.Canonicalization;
    }

    console.log("END LOOP");
    console.log("=> left:", left);
    console.log("=> right:", right);

    return [new ctor(left, right), action];
  });
}
