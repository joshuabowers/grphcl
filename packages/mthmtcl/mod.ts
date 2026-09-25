/**
 * Provides access to most of the public API portions of the
 * library.
 *
 * NB: the parser is available through the '/parsing' entry point;
 * however, as interpret is more generally useful, it is suggested
 * to use that latter construct by preference.
 *
 * @module
 */

export * as Functions from "./functions/mod.ts";
export * as Tree from "./tree/mod.ts";
export { interpret, type Parsing, Unicode } from "./parsing/mod.ts";
