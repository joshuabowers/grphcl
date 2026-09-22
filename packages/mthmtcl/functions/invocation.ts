import {
  Absolute,
  Addition,
  AlternativeDenial,
  Arcus,
  AreaHyperbolic,
  Biconditional,
  type BinaryNode,
  Boolean,
  Combination,
  Complement,
  Complex,
  Conjunction,
  ConverseImplication,
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
  type Numeric,
  Permutation,
  Real,
  Subtraction,
  type TreeNode,
  Trigonometric,
  type UnaryNode,
  Variable,
} from "../tree/mod.ts";
import { _, method, type Multi, multi } from "@arrows/multimethod";
import { is, type Predicate } from "../factories/factory.ts";
import type { UnaryFn } from "../factories/unary.ts";
import type { BinaryFn } from "../factories/binary.ts";
import { parameterize } from "../utility/parameterization.ts";
import { type Scope, scope as createScope } from "./variable.ts";
import { $add } from "./add.ts";
import { $multiply } from "./multiply.ts";
import { subtract } from "./subtract.ts";
import { $divide } from "./divide.ts";
import { $raise } from "./raise.ts";
import { $log } from "./log.ts";
import { equals, gt, gte, lt, lte, nequals } from "./relational.ts";
import {
  and,
  converse,
  implies,
  nor,
  not,
  or,
  xnor,
  xor,
} from "./logical/mod.ts";
import { nand } from "@bowers/mthmtcl/functions";
import { $combine, $permute } from "./combinatorics.ts";
import { $abs } from "./absolute.ts";
import { cos, cot, csc, sec, sin, tan } from "./trigonometric.ts";
import { $acos, $acot, $acsc, $asec, $asin, $atan } from "./arcus.ts";
import { cosh, coth, csch, sech, sinh, tanh } from "./hyperbolic.ts";
import {
  $acosh,
  $acoth,
  $acsch,
  $asech,
  $asinh,
  $atanh,
} from "./areaHyperbolic.ts";
import { factorial } from "./factorial.ts";
import { gamma } from "./gamma.ts";
import { canonicalize } from "../utility/canonicalization.ts";

type RewriteFn<T extends TreeNode> = (
  scope: Scope,
  expression: T,
) => TreeNode;

const numeric = <N extends Numeric>(): RewriteFn<N> => (_scope: Scope, n: N) =>
  n;

const unary = <U extends UnaryNode, R extends TreeNode | void>(
  fn: UnaryFn<U, R>,
): RewriteFn<U> =>
(scope: Scope, expression: U) => fn(evaluate(scope, expression.child));

const binary = <B extends BinaryNode, R extends TreeNode | void>(
  fn: BinaryFn<B, R>,
): RewriteFn<B> =>
(scope: Scope, expression: B) =>
  fn(
    evaluate(scope, expression.left),
    evaluate(scope, expression.right),
  );

const when = <T extends TreeNode>(
  predicate: Predicate<T>,
  rewrite: RewriteFn<T>,
) => method([_, predicate], rewrite);

interface EvaluateFn extends Multi {
  (scope: Scope, expression: TreeNode): TreeNode;
}

const evaluate: EvaluateFn = multi(
  when(is(Boolean), numeric<Boolean>()),
  when(is(Complex), numeric<Complex>()),
  when(is(Real), numeric<Real>()),
  //
  when(is(Variable), (scope, v) => scope.get(v.name) ?? v),
  //
  when(is(Addition), binary($add)),
  when(is(Multiplication), binary($multiply)),
  when(is(Subtraction), binary(subtract)),
  when(is(Division), binary($divide)),
  when(is(Exponentiation), binary($raise)),
  when(is(Logarithm), binary($log)),
  //
  when(is(Equality), binary(equals)),
  when(is(GreaterThan), binary(gt)),
  when(is(GreaterThanOrEquals), binary(gte)),
  when(is(LessThan), binary(lt)),
  when(is(LessThanOrEquals), binary(lte)),
  when(is(Inequality), binary(nequals)),
  //
  when(is(Complement), unary(not)),
  when(is(Conjunction), binary(and)),
  when(is(Disjunction), binary(or)),
  when(is(ExclusiveDisjunction), binary(xor)),
  when(is(Implication), binary(implies)),
  when(is(AlternativeDenial), binary(nand)),
  when(is(JointDenial), binary(nor)),
  when(is(Biconditional), binary(xnor)),
  when(is(ConverseImplication), binary(converse)),
  //
  when(is(Permutation), binary($permute)),
  when(is(Combination), binary($combine)),
  //
  when(is(Absolute), unary($abs)),
  //
  when(is(Trigonometric.Cosine), unary(cos)),
  when(is(Trigonometric.Cotangent), unary(cot)),
  when(is(Trigonometric.Cosecant), unary(csc)),
  when(is(Trigonometric.Secant), unary(sec)),
  when(is(Trigonometric.Sine), unary(sin)),
  when(is(Trigonometric.Tangent), unary(tan)),
  //
  when(is(Arcus.Cotangent), unary($acot)),
  when(is(Arcus.Cosecant), unary($acsc)),
  when(is(Arcus.Cosine), unary($acos)),
  when(is(Arcus.Secant), unary($asec)),
  when(is(Arcus.Sine), unary($asin)),
  when(is(Arcus.Tangent), unary($atan)),
  //
  when(is(Hyperbolic.Cosine), unary(cosh)),
  when(is(Hyperbolic.Cotangent), unary(coth)),
  when(is(Hyperbolic.Cosecant), unary(csch)),
  when(is(Hyperbolic.Secant), unary(sech)),
  when(is(Hyperbolic.Sine), unary(sinh)),
  when(is(Hyperbolic.Tangent), unary(tanh)),
  //
  when(is(AreaHyperbolic.Cotangent), unary($acoth)),
  when(is(AreaHyperbolic.Cosecant), unary($acsch)),
  when(is(AreaHyperbolic.Secant), unary($asech)),
  when(is(AreaHyperbolic.Cosine), unary($acosh)),
  when(is(AreaHyperbolic.Sine), unary($asinh)),
  when(is(AreaHyperbolic.Tangent), unary($atanh)),
  //
  when(is(Factorial), unary(factorial)),
  when(is(Gamma), unary(gamma)),
  // POLYGAMMA
  //
  when(
    is(Invocation),
    (scope, e) =>
      $invoke(scope)(evaluate(scope, e.expression))(
        e.args.map((a) => evaluate(scope, a)),
      ),
  ),
);

function* zip(parameters: Set<string>, args: TreeNode[]) {
  let i = 0;
  for (const name of parameters) {
    if (args[i]) yield [name, args[i]] as const;
    i++;
  }
}

export type InvocationFn = (
  scope?: Scope,
) => (expression: TreeNode) => (...args: TreeNode[]) => TreeNode;

/**
 * Internal implementation of {@link invoke}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $invoke: InvocationFn = (scope?: Scope) => {
  const inner: Scope = createScope(scope);
  return (expression: TreeNode) => {
    const parameters = parameterize(expression);
    return (...args: TreeNode[]): TreeNode => {
      for (const [name, value] of zip(parameters, args)) {
        inner.set(name, value);
      }
      return evaluate(inner, expression);
    };
  };
};

/**
 * Evaluates an expression in the context of a scope of
 * established variables, with the option of temporarily
 * overriding select variables with passed arguments.
 *
 * This function is nested, and must be called three times
 * to fully evaluate it; the first and second calls can be
 * cached to variables for convenience.
 *
 * The outer call establishes a {@link Scope} the invocation
 * should respect; this is never mutated.
 *
 * The second call establishes the AST {@link TreeNode}
 * expression which is to be evaluated. Any variables used
 * within it will be replaced subject to the scope generated
 * for the invocation.
 *
 * The third call, which executes the evaluation, takes an
 * optional array of arguments; these will be bound to any
 * variables in the second call's expression in alphabetical/
 * numerical order. (That is, the first argument will be bound
 * to the first variable found in expression, if all variable
 * names were sorted alphabetically.)
 *
 * The first call establishes an inner scope for the subsequent
 * calls: any assignments to it done in the third call are
 * not propagated to the scope passed to invoke.
 *
 * This function semantically evaluates the expression passed
 * to the second call: that is, any variables within it that
 * are bound in the inner scope will be replaced, and all nodes
 * of the resulting tree are rebuilt from leaves up to perform
 * rewrite rules associated with those operations.
 *
 * @example Calling without a scope; here, we see variable
 * 'x' bound to the first argument, and the `cos` function
 * re-evaluated with that value assignment.
 * ```ts
 * const result = invoke()(cos(variable('x')))(real(Math.PI));
 * // => real(-1)
 * ```
 *
 * @example Calling with a scope; here, a binding for
 * variable 'x' is found within the provided scope, causing
 * the re-evaluation.
 * ```ts
 * const s = scope(['x', real(Math.PI)]);
 * const result = invoke(s)(cos(variable('x')))();
 * // => real(-1)
 * ```
 *
 * @exaple Calling with a scope and arguments; any provided
 * arguments will shadow---override---bindings found within
 * a provided scope; here, variable 'x' gets resolved to the
 * argument value, rather than the scope value.
 * ```ts
 * const s = scope(['x', real(Math.PI)]);
 * const result = invoke(s)(cos(variable('x')))(real(0));
 * // => real(1)
 * ```
 *
 * @example Calling without a scope or arguments; sub-trees
 * are still re-evaluated, even if no variable substitutions
 * occur. This can be used to force a manually built AST to
 * be semantically evaluated.
 * ```ts
 * const node = new Addition(real(5), real(10));
 * const result = invoke()(node)();
 * // => real(15)
 * ```
 *
 * @example Invocation can be used to rewrite variables; here,
 * we see the variable 'x' replaced with the variable 'y'.
 * ```ts
 * const result = invoke()(cos(variable('x')))(variable('y'));
 * // => cos(variable('y'))
 * ```
 *
 * @example Invocation of an expression with multiple variables
 * will attempt to replace all variables for which values can
 * be determined; here, both 'x' and 'y' receive values: 'x'
 * from the passed argument, 'y' from the passed scope.
 * ```ts
 * const s = scope(['y', real(10)])
 * const result = invoke(s)(add(variable('x'), variable('y')))(real(5));
 * // => real(15)
 * ```
 *
 * @example Variables are bound according to their alphabetic
 * sorted order against the numerical order of passed arguments;
 * here, 'x' is assigned the first passed argument, 'y' the
 * second, despite their occurrance order within the expression.
 * ```ts
 * const result = invoke()(raise(variable('y'), variable('x')))(real(10), real(2));
 * // => real(1024)
 * ```
 *
 * @example If a variable does not receive a binding, it is
 * returned without substitution. This can be used to partially
 * evaluate an expression:
 * ```ts
 * const result = invoke()(add(variable('x'), variable('y')))(real(5));
 * // => add(real(5), variable('y'))
 * ```
 *
 * @example Superfluous arguments are ignored; only variables
 * found within the expression are bound to supplied values;
 * if more values are provided, they are not assigned to anything.
 * ```ts
 * const result = invoke()(cos(variable('x')))(real(0), real(Math.PI));
 * // => real(1)
 * ```
 * @param scope an optional scope to resolve variables from
 * @returns a function with a bound scope
 */
export const invoke: InvocationFn = (scope?: Scope) => {
  const scoped = $invoke(scope);
  return (expression: TreeNode) => {
    const parameterized = scoped(expression);
    return (...args: TreeNode[]) => canonicalize(parameterized(...args));
  };
};
