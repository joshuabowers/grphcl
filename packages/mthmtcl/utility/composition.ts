import type { TreeNode } from "../tree/mod.ts";
import { method, multi } from "@arrows/multimethod";
import type { InferParams, MathFn } from "../factories/factory.ts";

export const compose = <
  T extends TreeNode,
  Fn extends MathFn<T>,
>(
  fn: Fn,
  mutate: (expression: T) => TreeNode,
): Fn =>
  multi(
    method((...args: InferParams<T>) => mutate(fn(...args))),
  ) as Fn;
