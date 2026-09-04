import { Boolean, Negation } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { unary, when } from "../factories/unary.ts";

export const negate = unary(Negation, Boolean)(
  when(is(Boolean), (b) => [new Boolean(!b.raw), Action.Application]),
);
