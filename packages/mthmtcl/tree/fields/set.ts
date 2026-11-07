import { TreeNode } from "../treeNode.ts";
import type { Boolean } from "./boolean.ts";

export abstract class Set extends TreeNode {
  abstract get size(): number;
  abstract has(element: TreeNode): Boolean;

  override get fnName(): string {
    return "set";
  }
}
