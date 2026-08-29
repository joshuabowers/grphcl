import { BinaryNode } from "../binaryNode.ts";

/**
 * Represents a relation between nodes within the AST.
 *
 * This class exists primarily for untility: all subclasses
 * of Relation define 1-to-1 relationships between two
 * expressions; when at least one of those expressions is
 * reducible to a variable, a Relation is plottable.
 */
export class Relation extends BinaryNode {
}
