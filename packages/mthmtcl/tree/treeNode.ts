/**
 * Root of mthmtcl's Abstract Syntax Tree
 */
export abstract class TreeNode {
  /**
   * Determines where the node is plottable.
   *
   * Currently false for most node types.
   */
  get isPlottable(): boolean {
    return false;
  }

  abstract get fnName(): string;
}
