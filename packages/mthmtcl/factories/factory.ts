import type { method, Multi } from "@arrows/multimethod";

/**
 * Represents any constructor function for a class-based
 * object.
 */
// deno-lint-ignore no-explicit-any -- unknown[] doesn't work.
export type Constructor<T> = new (...args: any[]) => T;

/**
 * Returns A if not void, otherwise B.
 */
export type Choose<A, B> = A extends void ? B : A;

/**
 * The behavioral methodology applied by a math function
 */
export enum Action {
  /** One parameter absorbed by another */
  Absorption,
  /** The elimination of all parameters */
  Annihilator,
  Application,
  /** The creation of a new AST node of the given type */
  Creation,
  Idemptency,
  Identity,
  Tautology,
}

/**
 * The type of edge case which has been created.
 */
export enum Context {
  /** A numerical or algebraic analysis edge case  */
  Algebraic,
  /** An edge case of last resort */
  Otherwise,
}

/**
 * Defines an analysis edge case
 */
export type EdgeCase = {
  /** The type of edge case */
  context: Context;
  /** The behavior of the edge case; embeddable within a {@link multi} */
  method: typeof method;
};

/** Utility type for referencing specific types of edge cases. */
export type When<C extends Context> = EdgeCase & { context: C };

/**
 * A factory can define either nothing but {@link Context.Algebraic}
 * edge cases, or a set of the same followed by an
 * {@link Context.Otherwise} edge case.
 */
export type EdgeCases =
  | [...When<Context.Algebraic>[]]
  | [...When<Context.Algebraic>[], When<Context.Otherwise>];

/**
 * The typing for a funtion which takes {@link EdgeCases}
 * and generates a {@link Multi} from them.
 */
export type EdgeCaseFn<Fn extends Multi> = (...edgeCases: EdgeCases) => Fn;

/**
 * Type signature for a predicate function which acts as
 * type guard; this will assert that the passed value is
 * {@template T}
 */
export type Predicate<T> = (value: unknown) => value is T;

/**
 * Creates a type guard predicate which asserts type and
 * biases inference. While the main action is the type assertion,
 * this can also execute a further predicate afterwards to
 * further refine the truthiness.
 * @param ctor the constructor function for a class
 * @param inner an optional inner predicate to evaluate post type assertion
 * @returns a predicate type guard which can get very specific
 */
export const is = <T>(
  ctor: Constructor<T>,
  inner?: (value: T) => boolean,
): Predicate<T> =>
(value: unknown): value is T =>
  value instanceof ctor && (inner?.(value) ?? true);
