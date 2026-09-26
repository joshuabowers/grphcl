import type { TreeNode } from "../tree/mod.ts";
import { invoke, type Scope, scope as createScope } from "../functions/mod.ts";
import { parser } from "./parser.ts";

/**
 * Provides syntactically and semantically processed
 * Abstract Syntax Trees which have been created by the {@link parser}
 * and processed by {@link invoke}.
 */
export interface Parsing {
  /** The string which generated this parsing */
  source: string;
  /** An AST representation of the unevaluated, syntactically parsed source. */
  input: TreeNode;
  /** An AST representation of semantically evaluated input */
  output: TreeNode;
}

/**
 * Converts a source string containing a mathematical expression into
 * both a syntax tree and a semantically evaluated AST.
 *
 * This function first runs {@link source} through {@link parser},
 * then runs the result of that operation through {@link invoke}.
 * The return value is a {@link Parsing} which collects the results
 * of these two stages in the {@link Parsing.input | input} and
 * {@link Parsing.output | output} fields.
 *
 * @example Mathematical Parsing
 *
 * The {@link Parsing.input | input} field of the returned Parsing
 * contains an Abstract Syntax Tree; it will be a subclass of
 * {@link TreeNode}. This node is guaranteed to be otherwise
 * unevaluated: it just represents a direct syntax parse of the
 * supplied {@link source}.
 *
 * ```ts
 * const { input } = interpret('cos(x)')
 * // input => new Trigonometric.Cosine(new Variable('x'))
 * ```
 *
 * @example Numeric analysis
 *
 * The {@link Parsing.output | output} field of the returned Parsing
 * is the result of several different semantic analyses. The first to
 * consider is numeric: all operations working on known values are
 * reduced to a numerical value:
 *
 * ```ts
 * const { output } = interpret('5 * 10')
 * // output => new Real(50)
 * ```
 *
 * @example Algebraic analysis
 *
 * Whenever an expression contains, somewhere within its structure,
 * one or more indeterminate variables---variables which do not have
 * a binding defined within a {@link Scope}---the expression cannot
 * be fully reduced to a numerical value. However, quite a few
 * algebraic analyses are possible which can replace the noraml tree
 * which would be generated (e.g. within {@link Parsing.input | input})
 * with another which is semantically equivalent, but syntactically
 * simpler:
 *
 * ```ts
 * const { output } = interpret('(x + x) / x')
 * // output => real(2); the 'x' variables are combined, then canceled!
 * ```
 *
 * @example Tree canonicalization
 *
 * As part of the semantic analyses performed on the AST generated
 * by the parser, this will also canonicalize the result:
 *
 * ```ts
 * const { input, output } = interpret('x ** -1');
 * // input => new Exponentiation(new Variable('x'), new Negation(new Real(1)))
 * // output => new Division(new Real(1), new Variable('x'))
 * ```
 *
 * @example Associativity & Commutativity
 *
 * Both addition and multiplication exhibit the behaviors of
 * associativity and commutativity. The former describes the ability
 * to regroup the order in which nested operations of the same type
 * are performed without affecting the overall result; the latter
 * describes the ability to reorder the operands without affecting
 * the overall result. These behaviors are interconnected: if given
 * `1 + 2 + 3`, the order of both the operators and operands is
 * completely fluid and arbitrary. mthmtcl emulates this behavior,
 * and will use it to reduce trees which might otherwise be difficult
 * to process:
 *
 * ```ts
 * const { output } = interpret('(-x + 1) + (1 + x)')
 * // output => real(2)
 * ```
 *
 * @example Providing Scope
 *
 * A {@link Scope} may be provided as a second argument to `interpret`;
 * if one is not provided, `interpret` creates a default, empty
 * scope for its internal processing. If a scope is provided, it
 * will be altered by any assignments which occur during the
 * parsing phase. Variables found within the provided scope
 * will be replaced with the value binding within that scope, and
 * evaluated in the further context of any subexpressions they are
 * found within:
 *
 * ```ts
 * const s = scope([['x', real(10)]])
 * const { output } = interpret('x * (x - 5)', s)
 * // output => real(50)
 * ```
 *
 * @param source a string containing a mathematical expression
 * @param scope an optional scope for assignments and variable replacements
 * @returns a {@link Parsing} containing both the syntactic and semantic results
 */
export function interpret(
  source: string,
  scope: Scope = createScope(),
): Parsing {
  const input = parser.value(source, { context: scope });
  const output = invoke(scope)(input)();
  return ({ source, input, output });
}
