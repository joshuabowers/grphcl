import type { TreeNode } from "../treeNode.ts";
import { Boolean } from "./boolean.ts";
import { Set } from "./set.ts";
import { deepEquals } from "../../utility/deepEquals.ts";

export class Rostered extends Set {
  readonly elements: TreeNode[];

  constructor(...elements: TreeNode[]) {
    super();
    this.elements = elements.reduce<TreeNode[]>(
      (a, c) => a.some((i) => deepEquals(i, c)) ? a : [...a, c],
      [],
    );
  }

  override has(element: TreeNode): Boolean {
    return new Boolean(this.elements.some((r) => deepEquals(r, element)));
  }

  override get size(): number {
    return this.elements.length;
  }
}

/**
 * A {@link Set} which contains no elements.
 *
 * That is, for any potential value considered:
 * @example
 * ```ts
 * Empty.has(real(5)) // => boolean(false)
 * ```
 */
export const Empty: Set = new Rostered();
