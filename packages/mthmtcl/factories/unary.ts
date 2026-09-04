import {
  Action,
  type Choose,
  type Constructor,
  Context,
  type EdgeCaseFn,
  type Predicate,
  type When,
} from "./factory.ts";
import type {
  Boolean,
  Complex,
  Real,
  TreeNode,
  UnaryNode,
} from "../tree/mod.ts";
import { method, type Multi, multi } from "@arrows/multimethod";

/**
 * The type signature for a rewrite rule, mapping a T to an R.
 * The result contains an {@link Action} to specify why the
 * rewrite occurred.
 */
export type Perform<T, R = T> = (value: T) => [R, Action];

/**
 * Creates a {@link method}, providing a type-safe wrapping
 * context to simplify the construction. Used in tandem with
 * {@link unary} to define edge cases.
 * @param predicate a boolean valued guard
 * @param perform a rewrite rule to apply
 * @returns a contextual method, consumable by {@link unary}
 */
export const when = <T, R = T>(
  predicate: Predicate<T>,
  perform: Perform<T, R>,
): When<Context.Algebraic> => ({
  context: Context.Algebraic,
  method: method(predicate, perform),
});

/**
 * Creates a {@link method}, providing a type-safe wrapping
 * context to simplify the construction. Used in tandem with
 * {@link unary} to define an edge case of last resort.
 *
 * Unlike {@link when}, this should only be used once, as the
 * last defined edge case. By default, all {@link unary} derived
 * multimethods already have an otherwise block, which produces
 * an instance of their associated class type; this overrides
 * that method. Use with caution.
 * @param perform a rewrite rule to apply
 * @returns a contextual method, consumable by {@link unary}
 */
export const otherwise = <T extends TreeNode, R = T>(
  perform: Perform<T, R>,
): When<Context.Otherwise> => ({
  context: Context.Otherwise,
  method: method(perform),
});

/**
 * Describes the type of a multimethod-based unary function,
 * with several overloads described for common edge cases.
 * These will bias type inference. If the generic parmater, R,
 * is provided, it will override the default numeric return
 * types, which otherwise correspond to their input types.
 */
export interface UnaryFn<U extends UnaryNode, R extends TreeNode | void = void>
  extends Multi {
  (expression: Boolean): Choose<R, Boolean>;
  (expression: Complex): Choose<R, Complex>;
  (expression: Real): Choose<R, Real>;
  (expression: TreeNode): U;
}

/**
 * A factory for creating unary math functions.
 *
 * This needs to be invoked twice: the first invocation acts
 * as a sort of preamble which initializes the function construction,
 * while the second invocation is where edge cases are described
 * through use of {@link when} and {@link otherwise}.
 *
 * Should a second constructor be provided in the preamble, it
 * will be used to describe the return type of the generated
 * function for numerical analysis edge cases.
 *
 * @example
 * ```ts
 * const abs = unary(Absolute)(
 *   // ...
 *   when(is(Real), r => [new Real(Math.abs(r.raw)), Action.Application])
 *   // ...
 * );
 * ```
 * @param ctor type class constructor for the AST node type associated with this function
 * @param _ctorR an optional constructor for the associated return type override
 * @returns a function for describing the edge cases for the math function
 */
export function unary<U extends UnaryNode, R extends TreeNode | void = void>(
  ctor: Constructor<U>,
  _ctorR?: Constructor<R>,
): EdgeCaseFn<UnaryFn<U, R>> {
  return (...edgeCases) => {
    const last = edgeCases.findLast((ec) => ec.context === Context.Otherwise) ??
      otherwise((e) => [new ctor(e), Action.Creation]);
    return multi(
      ...edgeCases.filter((ec) => ec.context === Context.Algebraic).map((ec) =>
        ec.method
      ),
      last.method,
    );
  };
}
