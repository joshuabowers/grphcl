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
  type Real,
  Subtraction,
  type TreeNode,
  Trigonometric,
} from "../tree/mod.ts";
import type { Constructor } from "../factories/factory.ts";
import {
  boolean,
  complex,
  real,
  type Scope,
  variable,
} from "../functions/mod.ts";
import { $fail, type Parser, peg } from "pegase";
import { Unicode } from "./Unicode.ts";
import { EulerMascheroni } from "../functions/real.ts";

const letterRange = `_a-zA-Z${Unicode.theta}`;
const validIdentifier = new RegExp(
  `[${letterRange}][${letterRange}0-9]*`,
  "u",
);

const inequality = new Map<string, Constructor<TreeNode>>(
  [
    ["==", Equality],
    ["!=", Inequality],
    ["<=", LessThanOrEquals],
    [">=", GreaterThanOrEquals],
    ["<", LessThan],
    [">", GreaterThan],
  ],
);

const connectives = new Map<string, Constructor<TreeNode>>(
  [
    [Unicode.xnor, Biconditional],
    [Unicode.and, Conjunction],
    [Unicode.or, Disjunction],
    [Unicode.xor, ExclusiveDisjunction],
    [Unicode.implies, Implication],
    [Unicode.nand, AlternativeDenial],
    [Unicode.nor, JointDenial],
    [Unicode.converse, ConverseImplication],
  ],
);

type Functional =
  | [Constructor<TreeNode>, [], []]
  | [Constructor<TreeNode>, [TreeNode], []]
  | [Constructor<TreeNode>, [], [TreeNode]];

const functions = new Map<string, Functional>([
  ["lb", [Logarithm, [real(2)], []]],
  ["lg", [Logarithm, [real(10)], []]],
  ["ln", [Logarithm, [real(Math.E)], []]],
  ["acosh", [AreaHyperbolic.Cosine, [], []]],
  ["asinh", [AreaHyperbolic.Sine, [], []]],
  ["atanh", [AreaHyperbolic.Tangent, [], []]],
  ["asech", [AreaHyperbolic.Secant, [], []]],
  ["acsch", [AreaHyperbolic.Cosecant, [], []]],
  ["acoth", [AreaHyperbolic.Cotangent, [], []]],
  ["acos", [Arcus.Cosine, [], []]],
  ["asin", [Arcus.Sine, [], []]],
  ["atan", [Arcus.Tangent, [], []]],
  ["asec", [Arcus.Secant, [], []]],
  ["acsc", [Arcus.Cosecant, [], []]],
  ["acot", [Arcus.Cotangent, [], []]],
  ["cosh", [Hyperbolic.Cosine, [], []]],
  ["sinh", [Hyperbolic.Sine, [], []]],
  ["tanh", [Hyperbolic.Tangent, [], []]],
  ["sech", [Hyperbolic.Secant, [], []]],
  ["csch", [Hyperbolic.Cosecant, [], []]],
  ["coth", [Hyperbolic.Cotangent, [], []]],
  ["cos", [Trigonometric.Cosine, [], []]],
  ["sin", [Trigonometric.Sine, [], []]],
  ["tan", [Trigonometric.Tangent, [], []]],
  ["sec", [Trigonometric.Secant, [], []]],
  ["csc", [Trigonometric.Cosecant, [], []]],
  ["cot", [Trigonometric.Tangent, [], []]],
  ["abs", [Absolute, [], []]],
  [Unicode.gamma, [Gamma, [], []]],
  [Unicode.squareRoot, [Exponentiation, [], [real(0.5)]]],
]);

const operators = new Map<string, Constructor<TreeNode>>([
  ["+", Addition],
  ["-", Subtraction],
  ["*", Multiplication],
  ["/", Division],
  ...inequality,
  ...connectives,
]);

type Tail = {
  op: string;
  a: TreeNode;
  b?: Tail;
};

const leftAssociate = (
  node: TreeNode,
  tail: Tail | undefined,
): TreeNode | undefined => {
  if (!tail) return node;
  const operator = operators.get(tail.op);
  if (!operator) {
    $fail(`Unknown operator '${tail.op}' in expression`);
    return undefined;
  }
  return leftAssociate(
    new operator(node, tail.a),
    tail.b,
  );
};

type InvokeList = {
  a: TreeNode[];
  b?: InvokeList;
};

const createInvoke = (
  node: TreeNode,
  tail: InvokeList | undefined,
): TreeNode | undefined => {
  if (!tail) return node;
  return createInvoke(
    new Invocation(node, ...tail.a),
    tail.b,
  );
};

const builtInFunction = (
  name: string,
  expression: TreeNode,
): TreeNode | undefined => {
  const f = functions.get(name);
  if (!f) {
    $fail(`could not locate built-in function '${name}'`);
    return undefined;
  }
  const [ctor, left, right] = f;
  return new ctor(...[...left, expression, ...right]);
};

const capture = (s: string) => `"${s}"`;
const connectiveOperators = peg([...connectives.keys()].map(capture).join("|"));
const inequalityOperators = peg([...inequality.keys()].map(capture).join("|"));
const functional = peg([...functions.keys()].map(capture).join("|"));

// TODO:
// - [ ] Assignments
// - [ ] Nil
// - [ ] Variable in-situ replace (delay until invoke?)

export const parser: Parser<TreeNode, Scope> = peg<TreeNode, Scope>`
expression: <a>assignment

assignment:
| connectives

connectives: leftAssociative(inequality, ${connectiveOperators})

inequality: leftAssociative(addition, ${inequalityOperators})

addition: leftAssociative(multiplication, "+"|"-")

multiplication: leftAssociative(exponentiation, "*"|"/")

leftAssociative(itemType, operators): (
  head: <a>itemType <b>tail ${({ a, b }) => leftAssociate(a, b)}
  tail:
  | <op>operators <a>itemType <b>tail ${(tail) => tail}
  | ε
)


exponentiation:
| <a>invocation "**" <b>exponentiation ${({ a, b }) => new Exponentiation(a, b)}
| factorial
| invocation

factorial: <a>invocation <...b>("!"+) &('=='|!('='{1})) ${(
  { a, b }: { a: TreeNode; b: TreeNode[] },
) => b.reduce((e) => new Factorial(e), a)}

invocation: (
  head: <a>group <b>tail ${({ a, b }) => createInvoke(a, b)}
  tail:
  | '(' <...a>parameters ')' <b>tail ${(tail) => tail}
  | ε
  parameters: expression % ','
)

group:
| "-" !complex <>group ${({ group }) => new Negation(group)}
| $logicalComplement <>group ${({ group }) => new Complement(group)}
| functional
| derivative
| '(' expression ')'
| '[' expression ']'
| '{' expression '}'
| primitive

functional:
| <name>builtInFunction '(' ^ <>expression ')' ${(
  { name, expression }: { name: string; expression: TreeNode },
) => builtInFunction(name, expression)}
| ${Unicode.digamma} '(' <order>expression ',' ^ <>expression ')' ${(
  { order, expression },
) => new Polygamma(order, expression)}
| ${Unicode.digamma} '(' ^ <>expression ')' ${({ expression }) =>
  new Polygamma(real(0), expression)}
| 'P' '(' <n>expression ',' <r>expression ')' ${({ n, r }) =>
  new Permutation(n, r)}
| 'C' '(' <n>expression ',' <r>expression ')' ${({ n, r }) =>
  new Combination(n, r)}
| 'log' '(' <b>expression ',' <v>expression ')' ${({ b, v }) =>
  new Logarithm(b, v)}

builtInFunction: ${functional}

derivative:
| ${Unicode.derivative} '(' <order>real ',' ^ <>expression ')' ${(
  { order, expression }: { order: Real; expression: TreeNode },
) => new Differentiation(expression, order)}
| ${Unicode.derivative} '(' <>expression ')' ${({ expression }) =>
  new Differentiation(expression)}

primitive:
| variable
| constant

constant:
| complex
| real
| boolean

variable:
| <name>$variable ${({ name }) => variable(name)}

complex:
| <n>"-"? <a>real "+" <b>real? $i ${({ n, a, b }) => {
  return complex((n ? -1 : 1) * a.raw, b?.raw ?? 1);
}}
| <n>"-"? <a>real "-" <b>real? $i ${({ n, a, b }) =>
  complex((n ? -1 : 1) * a.raw, -(b?.raw ?? 1))}
| <n>"-"? <b>real? $i ${({ n, b }) => complex(0, (n ? -1 : 1) * (b?.raw ?? 1))}

real:
| <value>$real ${({ value }) => real(Number(value))}
| $e ${() => real(Math.E)}
| $euler ${() => EulerMascheroni}
| $pi ${() => real(Math.PI)}
| $infinity ${() => real(Infinity)}

boolean:
| $true ${() => boolean(true)}
| $false ${() => boolean(false)}

keywords: 
| builtInFunction
| $nil
| $true
| $false

$real @raw: /(?:0|[1-9][0-9]*|(?=\.))(?:\.[0-9]+)?(?:E\-?(?:[1-9][0-9]*)+)?/
$variable @raw: !(keywords) ${validIdentifier}
$i @raw: ${RegExp(Unicode.i, "u")}
$e @raw: ${RegExp(Unicode.e, "u")}
$euler @raw: ${RegExp(Unicode.euler, "u")}
$pi @raw: ${RegExp(Unicode.pi, "u")}
$infinity @raw: ${RegExp(Unicode.infinity, "u")}
$nil @raw: /nil/
$true @raw: /true/
$false @raw: /false/
$logicalComplement @raw: ${RegExp(Unicode.not, "u")}
`;
