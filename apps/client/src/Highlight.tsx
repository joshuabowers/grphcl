import {
  Absolute,
  Addition,
  AlternativeDenial,
  Arcus,
  AreaHyperbolic,
  Biconditional,
  BinaryNode,
  Boolean,
  Combination,
  Complement,
  Complex,
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
  Logical,
  Multiplication,
  Negation,
  Numeric,
  Permutation,
  Polygamma,
  Real,
  Subtraction,
  TreeNode,
  Trigonometric,
  UnaryNode,
  Unicode,
  Variable,
} from "@bowers/mthmtcl";
import { _, method, type Multi, multi } from "@arrows/multimethod";
import { is } from "@bowers/mthmtcl/factories";
import type { JSX } from "solid-js";
import styles from "./Highlight.module.css";

function when<T extends TreeNode>(
  predicate: (expression: T) => expression is T,
  rewrite: (expression: T) => JSX.Element,
) {
  return method(predicate, rewrite);
}

function numeric<T extends Numeric>(fn: (expression: T) => JSX.Element) {
  return (expression: T) => <span class={styles.numeric}>{fn(expression)}
  </span>;
}

interface SymbolicFn extends Multi {
  (value: number): string | number;
}

// TODO: Click to expand to number?
const symbolic: SymbolicFn = multi(
  // TODO: expose EulerMascheroni
  method((v: number) => v === Math.PI, Unicode.pi),
  method((v: number) => v === Math.E, Unicode.e),
  method((v: number) => v === Infinity, Unicode.infinity),
  method((v: number) => v === -Infinity, `-${Unicode.infinity}`),
  method((v: number) => v),
);

interface itsComplicatedFn extends Multi {
  (a: number, b: number): string | number;
}

const is0 = (v: number) => v === 0;
const is1 = (v: number) => v === 1;
const isNeg = (v: number) => v < 0;
const isNeg1 = (v: number) => v === -1;

const itsComplicated: itsComplicatedFn = multi(
  method([is0, isNeg1], (_a: number, _b: number) => `-${Unicode.i}`),
  method([is0, is1], (_a: number, _b: number) => Unicode.i),
  method([is0, _], (_a: number, b: number) => `${b}${Unicode.i}`),
  method([_, is1], (a: number, _b: number) => `${a}+${Unicode.i}`),
  method([_, is0], (a: number, _b: number) => a),
  method([_, isNeg1], (a: number, _b: number) => `${a}-${Unicode.i}`),
  method([_, isNeg], (a: number, b: number) => `${a}${b}${Unicode.i}`),
  method((a: number, b: number) => `${a}+${b}${Unicode.i}`),
);

function parenthesize(children: JSX.Element) {
  return <span class={styles.parentheses}>({children})</span>;
}

function wrapAndHighlight(_parent: BinaryNode, child: TreeNode) {
  return parenthesize(highlight(child));
}

interface WrapFn extends Multi {
  (parent: BinaryNode | UnaryNode, child: TreeNode): JSX.Element;
}

const wrap: WrapFn = multi(
  method([is(Multiplication), is(Addition)], wrapAndHighlight),
  method([is(Multiplication), is(Subtraction)], wrapAndHighlight),
  method([is(Division), is(Addition)], wrapAndHighlight),
  method([is(Division), is(Subtraction)], wrapAndHighlight),
  method([is(Division), is(Multiplication)], wrapAndHighlight),
  method([is(Division), is(Division)], wrapAndHighlight),
  method([
    is(Exponentiation),
    (c: TreeNode) => ![Real, Variable].some((ctor) => c instanceof ctor),
  ], wrapAndHighlight),
  method([is(Negation), is(Addition)], wrapAndHighlight),
  method([is(Negation), is(Subtraction)], wrapAndHighlight),
  method([is(Complement), is(Logical)], wrapAndHighlight),
  method((_p: BinaryNode, c: TreeNode) => highlight(c)),
);

function functional(fnName: string, child: TreeNode) {
  return (
    <span class={styles.functional}>
      {fnName}
      {parenthesize(highlight(child))}
    </span>
  );
}

function unary<T extends UnaryNode>(fnName: string) {
  return (expression: T) => (
    functional(fnName, expression.child)
  );
}

function unaryOp<T extends UnaryNode>(
  fnName: string,
  type: "prefix" | "postfix",
) {
  return (expression: T) => (
    <span class={styles.operator}>
      {[
        type === "prefix" && fnName,
        wrap(expression, expression.child),
        type === "postfix" && fnName,
      ].filter((i) => !!i)}
    </span>
  );
}

function partial<T extends BinaryNode>(
  fnName: string,
  selector: (expression: T) => TreeNode,
) {
  return (expression: T) => (
    functional(fnName, selector(expression))
  );
}

function binary<T extends BinaryNode>(fnName: string, type: "infix" | "func") {
  return type === "infix"
    ? (expression: T) => (
      <>
        {wrap(expression, expression.left)}
        <span class={styles.operator}>{fnName}</span>
        {wrap(expression, expression.right)}
      </>
    )
    : (expression: T) => (
      <span class={styles.functional}>
        {fnName}
        {parenthesize(
          <>
            {highlight(expression.left)}
            <span class={styles.operator}>,</span>
            {highlight(expression.right)}
          </>,
        )}
      </span>
    );
}

export interface HighlightFn extends Multi {
  (expression: TreeNode | undefined): JSX.Element;
}

export const highlight: HighlightFn = multi(
  when(is(Boolean), numeric((b) => b.raw.toString())),
  when(
    is(Complex),
    numeric((c) => itsComplicated(c.raw.a, c.raw.b)),
  ),
  when(is(Real), numeric((r) => symbolic(r.raw))),
  when(is(Variable), (v) => <span class={styles.variable}>{v.name}</span>),
  when(is(Addition), binary("+", "infix")),
  when(is(Subtraction), binary("-", "infix")),
  when(is(Multiplication), binary("*", "infix")),
  when(is(Division), binary("/", "infix")),
  when(is(Exponentiation), binary("**", "infix")),
  when(is(Permutation), binary("P", "func")),
  when(is(Combination), binary("C", "func")),
  // TODO: Replace with isValue check!
  when(
    is(Logarithm, (l) => is(Real)(l.left) && l.left.raw === 2),
    partial("lb", (l) => l.right),
  ),
  when(
    is(Logarithm, (l) => is(Real)(l.left) && l.left.raw === Math.E),
    partial("ln", (l) => l.right),
  ),
  when(
    is(Logarithm, (l) => is(Real)(l.left) && l.left.raw === 10),
    partial("lg", (l) => l.right),
  ),
  when(is(Logarithm), binary("log", "func")),
  when(is(Negation), unaryOp("-", "prefix")),
  when(is(Absolute), unary("abs")),
  when(is(Factorial), unaryOp("!", "postfix")),
  when(is(Gamma), unary(Unicode.gamma)),
  when(
    is(Polygamma, (p) => is(Real)(p.left) && p.left.raw === 0),
    partial(Unicode.digamma, (p) => p.right),
  ),
  when(is(Polygamma), binary(Unicode.digamma, "func")),
  when(is(Equality), binary("==", "infix")),
  when(is(GreaterThan), binary(">", "infix")),
  when(is(GreaterThanOrEquals), binary(">=", "infix")),
  when(is(LessThan), binary("<", "infix")),
  when(is(LessThanOrEquals), binary("<=", "infix")),
  when(is(Inequality), binary("!=", "infix")),
  when(is(Conjunction), binary(Unicode.and, "infix")),
  when(is(Disjunction), binary(Unicode.or, "infix")),
  when(is(ExclusiveDisjunction), binary(Unicode.xor, "infix")),
  when(is(Implication), binary(Unicode.implies, "infix")),
  when(is(AlternativeDenial), binary(Unicode.nand, "infix")),
  when(is(JointDenial), binary(Unicode.nor, "infix")),
  when(is(Biconditional), binary(Unicode.xnor, "infix")),
  when(is(ConverseImplication), binary(Unicode.converse, "infix")),
  when(is(Trigonometric.Cosine), unary("cos")),
  when(is(Trigonometric.Sine), unary("sin")),
  when(is(Trigonometric.Tangent), unary("tan")),
  when(is(Trigonometric.Secant), unary("sec")),
  when(is(Trigonometric.Cosecant), unary("csc")),
  when(is(Trigonometric.Cotangent), unary("cot")),
  when(is(Arcus.Cosine), unary("acos")),
  when(is(Arcus.Sine), unary("asin")),
  when(is(Arcus.Tangent), unary("atan")),
  when(is(Arcus.Secant), unary("asec")),
  when(is(Arcus.Cosecant), unary("acsc")),
  when(is(Arcus.Cotangent), unary("acot")),
  when(is(Hyperbolic.Cosine), unary("cosh")),
  when(is(Hyperbolic.Sine), unary("sinh")),
  when(is(Hyperbolic.Tangent), unary("tanh")),
  when(is(Hyperbolic.Secant), unary("sech")),
  when(is(Hyperbolic.Cosecant), unary("csch")),
  when(is(Hyperbolic.Cotangent), unary("coth")),
  when(is(AreaHyperbolic.Cosine), unary("acosh")),
  when(is(AreaHyperbolic.Sine), unary("asinh")),
  when(is(AreaHyperbolic.Tangent), unary("atanh")),
  when(is(AreaHyperbolic.Secant), unary("asech")),
  when(is(AreaHyperbolic.Cosecant), unary("acsch")),
  when(is(AreaHyperbolic.Cotangent), unary("acoth")),
  when(is(Complement), unaryOp(Unicode.not, "prefix")),
  when(
    is(Differentiation),
    (d) => functional(Unicode.derivative, d.expression),
  ),
  when(
    is(Invocation),
    (i) => (
      <span class={styles.functional}>
        {highlight(i.expression)}
        {parenthesize(
          i.args.flatMap((c, j) => [
            highlight(c),
            // deno-lint-ignore jsx-key
            j < i.args.length - 1 ? <span class={styles.operator}>,</span> : "",
          ]),
        )}
      </span>
    ),
  ),
  method(
    (e: unknown) => !e,
    (_e: unknown) => (
      <span class={styles.error}>highlight: received undefined node</span>
    ),
  ),
  method((e: TreeNode) => (
    <span class={styles.unhandled}>{JSON.stringify(e, null, 2)}</span>
  )),
);

export interface HighlightProps {
  expression: TreeNode | undefined;
}

export const Highlight = (props: HighlightProps) => highlight(props.expression);
