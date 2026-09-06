import type { Boolean, Complex, Field, Real } from "../tree/mod.ts";
import { method, type Multi, multi } from "@arrows/multimethod";
import type { Action, Constructor, Predicate } from "./factory.ts";

/**
 * Describes a function which takes an input and converts it
 * to an output.
 */
export type ConvertFn<I, O> = (i: I) => O;

/**
 * Describes a function which, in addition to conversion,
 * logs the {@link Action} taken.
 */
export type RewriteFn<I, O = I> = (i: I) => [O, Action];

/**
 * Describes a function which takes a {@link ConvertFn} and
 * generates a {@link method} from it.
 */
export type EdgeCase<Params, T> = (fn: ConvertFn<Params, T>) => typeof method;

/**
 * Describes a function which takes a set of {@link EdgeCase}
 * and creates a flavored {@link Multi} from it.
 */
export type EdgeCaseFn<Fn extends Multi, Params, T> = (
  ...edgeCases: EdgeCase<Params, T>[]
) => Fn;

/**
 * Describes a function which takes a conversion function
 * to invoke when generating its {@link method} output.
 */
export type ImbueMethodFn<T, I, Params> = (
  fn: ConvertFn<Params, T>,
) => typeof method;

/**
 * Used to specify edge cases for a {@link FieldFn} created
 * by {@link field}. The generated {@link method} will delegate
 * to {@link fn} to convert {@link Params} into a {@link T}.
 * @param predicate a guard which must pass for this edge case to trigger
 * @param rewrite the rewrite rule invoked if {@link predicate} is true
 * @returns an internal function which generates a {@link method}
 */
export const when = <T, I, Params>(
  predicate: Predicate<I>,
  rewrite: RewriteFn<I, Params>,
): ImbueMethodFn<T, I, Params> =>
(fn: ConvertFn<Params, T>) => method(predicate, (i: I) => fn(rewrite(i)[0]));

/**
 * Represents a function capable of creating instances of
 * {@link Raw}-flavored {@link Field} objects bound to
 * {@link T}.
 *
 * When a function of this type is presented with a
 * {@link Params} tuple, it creates {@link T} directly;
 * otherwise, it casts the passed numeric type.
 */
export interface FieldFn<
  T extends Field<Raw>,
  Raw,
  Params extends unknown[],
> extends Multi {
  /** Creates a {@link T} from raw parameters */
  (...raw: Params): T;
  /** Creates a {@link T} from a {@link Boolean} */
  (b: Boolean): T;
  /** Creates a {@link T} from a {@link Complex} */
  (c: Complex): T;
  /** Creates a {@link T} from a {@link Real} */
  (r: Real): T;
}

/**
 * A factory for creating {@link FieldFn} compatible derived
 * functions of type {@link T}.
 *
 * @param ctor the constructor for the AST Field this creates
 * @param convert a function for mapping {@link Params} to
 * {@link Raw}.
 *
 * @example
 * ```ts
 * const real = field(Real, ([n]: [number] => n))(
 * );
 * ```
 */
export function field<
  T extends Field<Raw>,
  Raw,
  Params extends unknown[],
>(
  ctor: Constructor<T>,
  convert: ConvertFn<Params, Raw>,
): EdgeCaseFn<FieldFn<T, Raw, Params>, Params, T> {
  return (...edgeCases): FieldFn<T, Raw, Params> => {
    return multi(
      ...edgeCases.map((ec) => ec((params) => new ctor(convert(params)))),
      method((...params: Params) => new ctor(convert(params))),
    );
  };
}
