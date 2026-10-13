import { _, method, type Multi, multi } from "@arrows/multimethod";
import type { TreeNode } from "../../treeNode.ts";
import { BinaryNode } from "../binaryNode.ts";
import { is } from "../../../factories/factory.ts";
import { parameterize } from "../../../utility/parameterization.ts";
import { Variable } from "../../variable.ts";
import { UnaryNode } from "../../unary/unaryNode.ts";
import { Boolean } from "../../fields/boolean.ts";
import { Complex } from "../../fields/complex.ts";
import { Real } from "../../fields/real.ts";

/**
 * The numeric domain; one of boolean, complex, or real.
 *
 * Note, when dealing with pure variables, a domain is assumed
 * to be 'real'; further, for mixed subdomains, booleans are lifted
 * to reals or complexes; reals to complexes.
 */
export type Domain = "boolean" | "complex" | "real";

interface BinaryDomainFn extends Multi {
  (
    left: Domain,
    right: Domain,
  ): Domain;
}

const binaryDomain: BinaryDomainFn = multi(
  method(["boolean", "real"], "real"),
  method(["boolean", "boolean"], "boolean"),
  method(["complex", _], "complex"),
  method([_, "complex"], "complex"),
  method(["real", "boolean"], "real"),
  method(["real", "real"], "real"),
);

interface DomainFn extends Multi {
  (expression: TreeNode): Domain;
}

const domain: DomainFn = multi(
  method(is(Boolean), "boolean"),
  method(is(Complex), "complex"),
  method(is(Real), "real"),
  method(is(Variable), "real"),
  method(is(UnaryNode), (e: UnaryNode) => domain(e.child)),
  method(
    is(BinaryNode),
    (e: BinaryNode) => binaryDomain(domain(e.left), domain(e.right)),
  ),
);

/**
 * Represents a relation between nodes within the AST.
 *
 * This class exists primarily for untility: all subclasses
 * of Relation define 1-to-1 relationships between two
 * expressions; when at least one of those expressions is
 * reducible to a variable, a Relation is plottable.
 */
export abstract class Relation extends BinaryNode {
  /** A set of {@link Variable} found within this relation */
  readonly variables: Set<string>;

  /** The name of the alphabetically last {@link Variable} */
  readonly dependent: string | undefined;

  /** The names of all non-{@link dependent} {@link variables} */
  readonly independent: string[];

  /** Indicates if the left subtree is the only occurence of {@link dependant} */
  readonly isDependentLeftIsolated: boolean;

  /** Inddicates the inferred type of data this relation handles */
  readonly domainType: Domain;

  /**
   * Creates a new Relation AST Node.
   *
   * This will discover all {@link Variable} nodes within its
   * left and right subtrees, populating {@link variables} with
   * the found names. The Relation will also track two variations
   * on this set: the {@link dependent} variable name, and the
   * names of all other {@link independent} variables.
   *
   * NB: please refer to {@link isPlottable}, which this class
   * overrides, for more information about plottability.
   * @param left The left subtree
   * @param right The Right subtree
   */
  constructor(left: TreeNode, right: TreeNode) {
    super(left, right);
    this.variables = parameterize(this);
    const [dep, ...ind] = [...this.variables.keys()].reverse();
    this.dependent = dep;
    this.independent = ind.reverse();
    const rightVariables = parameterize(right);
    this.isDependentLeftIsolated = is(Variable)(this.left) &&
      this.left.name === this.dependent &&
      !rightVariables.has(this.dependent);
    this.domainType = domain(this);
  }

  /**
   * Determines whether this Relation is plottable.
   *
   * Plottabiliy is currently defined for relations of up to two
   * variables---a dependant variable and an independent variable---
   * where the dependent variable is isolated as the direct left
   * subtree of this relation. Further, the {@link domainType} must
   * also be 'real'.
   */
  override get isPlottable(): boolean {
    return this.variables.size <= 2 &&
      this.isDependentLeftIsolated &&
      this.domainType === "real";
  }
}
