import { TreeNode } from "./treeNode.ts";

/**
 * Represents variable nodes within the AST
 */
export class Variable extends TreeNode {
  /** The name of the variable */
  readonly name: string;

  /**
   * Creates a new variable
   * @param name The identifier to associate with the variable
   */
  constructor(name: string) {
    super();
    this.name = name;
  }
}
