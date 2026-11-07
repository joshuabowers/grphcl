import type { TreeNode } from "../treeNode.ts";
import { Boolean } from "./boolean.ts";
import { Set } from "./set.ts";

export type InclusionFn = (element: TreeNode) => Boolean;

export class Built extends Set {
  constructor(readonly inclusion: InclusionFn, readonly superset?: Set) {
    super();
  }

  override has(element: TreeNode): Boolean {
    if (this.superset) {
      return new Boolean(
        this.superset.has(element).raw && this.inclusion(element).raw,
      );
    } else {
      return this.inclusion(element);
    }
  }

  override get size(): number {
    return Infinity;
  }
}

/**
 * The Universe is a {@link Set} which contains all elements.
 *
 * That is:
 * @example
 * ```ts
 * Universe.has(real(5)) // => boolean(true)
 * ```
 */
export const Universe: Set = new Built((_x) => new Boolean(true));
