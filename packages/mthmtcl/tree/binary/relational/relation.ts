import type { TreeNode } from "../../treeNode.ts";
import { BinaryNode } from "../binaryNode.ts";
import { parameterize } from "../../../utility/parameterization.ts";

/**
 * Represents a relation between nodes within the AST.
 *
 * This class exists primarily for untility: all subclasses
 * of Relation define 1-to-1 relationships between two
 * expressions; when at least one of those expressions is
 * reducible to a variable, a Relation is plottable.
 */
export abstract class Relation extends BinaryNode {
  readonly variables: Set<string>;
  readonly dependent: string;
  readonly independent: string[];

  constructor(left: TreeNode, right: TreeNode) {
    super(left, right);
    this.variables = parameterize(this);
    const [dep, ...ind] = [...this.variables.keys()].reverse();
    this.dependent = dep;
    this.independent = ind.reverse();
  }
}
