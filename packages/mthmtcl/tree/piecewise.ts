/**
 * Warning: Speculative WIP. Unstable. Very subject to change.
 * Thar be dragons.
 */

import { TreeNode } from "./treeNode.ts";
import type { Relation } from "./binary/relational/relation.ts";

/**
 * Represents a subdomain within a {@link Piecewise} function
 * within the AST.
 *
 * A subdomain is defined as a sub-function {@link expression}
 * which is valid over a set {@link interval}.
 */
export class Subdomain {
  /**
   * The subset of the domain over which a variable in
   * {@link expression} varies. Should be of the form:
   * `Variable OP value`
   */
  readonly interval: Relation;

  /**
   * The sub-function which is applicable over the associated
   * {@link interval}. Should have the same variable which
   * is present within interval.
   */
  readonly expression: TreeNode;

  /**
   * Creates a new Subdomain over the given parameters.
   * @param interval a relation describing the applicable domain
   * @param expression a sub-function describing a calculation
   */
  constructor(interval: Relation, expression: TreeNode) {
    this.interval = interval;
    this.expression = expression;
  }
}

/**
 * Represents piecewise functions within the AST.
 *
 * A piecewise function is defined by a set of interval-based
 * sub-functions. Each of the {@link subdomains} describes a
 * slice of the overall function.
 *
 * @example
 * ```ts
 * const fn = new Piecewise(
 *   new Subdomain(
 *     new LessThan(new Variable('x'), new Real(0)),
 *     new Negation(new Variable('x'))
 *   ),
 *   new Subdomain(
 *     new GreaterThanOrEqual(new Variable('x'), new Real(0)),
 *     new Trigonometric.Sine(new Variable('x'))
 *   )
 * )
 * ```
 *
 * TODO: This likely needs to verify that:
 * 1. All relations are of the form `Variable OP value`
 * 2. All relations are on the same variable
 * 3. The variable within the relations is present in the
 *    associated expressions.
 * 4. No two relations overlap the same point.
 *    Gaps fine; overlap bad.
 */
export class Piecewise extends TreeNode {
  /**
   * The subdomains over which this piecewise function is
   * defined. These must be defined with the following caveats:
   * 1. They all contain the exact same variable within their
   *    subdomains;
   * 2. They do not overlap. If two subdomains meet at
   *    the same endpoint, either one or both need to be open
   *    at that endpoint.
   */
  readonly subdomains: Subdomain[];

  /**
   * Creates a new Piecewise function from a set of subdomains.
   * @param subdomains The Subdomains this is defined over.
   */
  constructor(...subdomains: Subdomain[]) {
    super();
    this.subdomains = subdomains;
  }
}
