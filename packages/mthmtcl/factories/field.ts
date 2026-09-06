import type { Boolean, Complex, Field, Real } from "../tree/mod.ts";
import { method, type Multi, multi } from "@arrows/multimethod";
import type { Action, Constructor, Predicate } from "./factory.ts";

export type ConvertFn<I, O> = (i: I) => O;

export type RewriteFn<I, O = I> = (i: I) => [O, Action];

export type EdgeCase<Params, T> = (fn: ConvertFn<Params, T>) => typeof method;
export type EdgeCaseFn<Fn extends Multi, Params, T> = (
  ...edgeCases: EdgeCase<Params, T>[]
) => Fn;

export const when = <T, I, Params>(
  predicate: Predicate<I>,
  rewrite: RewriteFn<I, Params>,
) =>
(fn: ConvertFn<Params, T>) => method(predicate, (i: I) => fn(rewrite(i)[0]));

export interface FieldFn<
  T extends Field<Raw>,
  Raw,
  Params extends unknown[],
> extends Multi {
  (...raw: Params): T;
  (b: Boolean): T;
  (c: Complex): T;
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
  return (...edgeCases) => {
    return multi(
      ...edgeCases.map((ec) => ec((params) => new ctor(convert(params)))),
      method((...params: Params) => new ctor(convert(params))),
    );
  };
}
