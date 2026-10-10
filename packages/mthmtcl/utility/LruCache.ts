type ListNode<Key, Value> = {
  key: Key;
  value: Value;
  prev?: ListNode<Key, Value>;
  next?: ListNode<Key, Value>;
};

/**
 * A key and value yielded by an {@link LruCache}.
 */
export type Pair<Key, Value> = Pick<ListNode<Key, Value>, "key" | "value">;

/**
 * A bounded cache that evicts the least recently used entry when full.
 *
 * Entries are ordered from most recently used (MRU) to least recently used
 * (LRU). Calling {@link LruCache.get} for a cached key or setting a key moves
 * it to the MRU position. When a new key is set at capacity, the LRU entry is
 * evicted.
 *
 * @example
 * ```ts
 * const cache = new LruCache<string, number>(2);
 * cache.set("a", 1).set("b", 2);
 *
 * cache.get("a");       // 1; "a" becomes most recently used
 * cache.set("c", 3);    // evicts "b", the least recently used key
 * [...cache.keys()];    // ["c", "a"] (MRU to LRU)
 * ```
 */
export class LruCache<Key, Value> {
  private index: Map<Key, ListNode<Key, Value>>;
  private head?: ListNode<Key, Value>;
  private tail?: ListNode<Key, Value>;
  private count: number;

  /**
   * Create a cache with a maximum capacity.
   *
   * @param limit Maximum number of entries the cache can hold. Must be
   * positive.
   * @throws {Error} If `limit` is zero or negative.
   */
  constructor(
    /** Maximum number of entries this cache can hold. */
    readonly limit: number,
  ) {
    if (limit <= 0) throw new Error("An LruCache needs a positive limit");
    this.index = new Map<Key, ListNode<Key, Value>>();
    this.count = 0;
  }

  /**
   * Get a value by key, promoting a present entry to most recently used.
   *
   * @param key Key to look up.
   * @returns The associated value, or `undefined` if the key is absent.
   *
   * @example
   * ```ts
   * const cache = new LruCache<string, number>(2);
   * cache.set("answer", 42);
   * cache.get("answer"); // 42
   * cache.get("missing"); // undefined
   * ```
   */
  get(key: Key): Value | undefined {
    const node: ListNode<Key, Value> | undefined = this.index.get(key);
    if (node) {
      const { prev, next } = node;
      if (prev) prev.next = next;
      if (next) next.prev = prev;
      node.prev = undefined;
      node.next = this.head;
      if (this.tail === node) this.tail = prev;
      if (this.head) this.head.prev = node;
      this.head = node;
    }
    return node?.value;
  }

  /**
   * Add or replace a value, making its key the most recently used.
   *
   * If `key` is new and the cache is at capacity, the least recently used
   * entry is evicted. Returns this cache to allow chained calls.
   *
   * @param key Key associated with the value.
   * @param value Value to store.
   * @returns This cache.
   *
   * @example
   * ```ts
   * const cache = new LruCache<string, number>(2);
   * cache.set("a", 1).set("b", 2).set("a", 3);
   * cache.get("a"); // 3
   * ```
   */
  set(key: Key, value: Value): LruCache<Key, Value> {
    let nova: ListNode<Key, Value> | undefined = this.index.get(key);
    if (!nova) {
      nova = { key, value };
      if (this.count === this.limit) {
        if (this.tail) this.delete(this.tail.key);
      }
      this.count++;
    }
    nova = { key, value, prev: undefined, next: this.head };
    if (this.head) this.head.prev = nova;
    this.index.set(key, nova);
    if (!this.tail) this.tail = nova;
    this.head = nova;
    return this;
  }

  /**
   * Remove all entries from the cache.
   *
   * @example
   * ```ts
   * const cache = new LruCache<string, number>(2).set("a", 1);
   * cache.clear();
   * cache.size; // 0
   * ```
   */
  clear() {
    this.head = undefined;
    this.tail = undefined;
    this.count = 0;
    this.index.clear();
  }

  /**
   * Remove an entry by key.
   *
   * @param key Key to remove.
   * @returns `true` if an entry was removed; otherwise `false`.
   */
  delete(key: Key): boolean {
    const node = this.index.get(key);
    if (!node) return false;
    const { prev, next } = node;
    if (prev) prev.next = next;
    if (next) next.prev = prev;
    if (this.tail === node) this.tail = prev;
    if (this.head === node) this.head = next;
    this.count--;
    return this.index.delete(key);
  }

  /**
   * Check whether a key is in the cache without changing its recency.
   *
   * @param key Key to check.
   * @returns `true` if the key is present; otherwise `false`.
   */
  has(key: Key): boolean {
    return this.index.has(key);
  }

  /**
   * Iterate over cached key-value pairs from most recently used to least
   * recently used.
   *
   * @returns An iterator of {@link Pair} values.
   *
   * @example
   * ```ts
   * const cache = new LruCache<string, number>(2);
   * cache.set("a", 1).set("b", 2);
   * [...cache.entries()]; // [{ key: "b", value: 2 }, { key: "a", value: 1 }]
   * ```
   */
  *entries(): IterableIterator<Pair<Key, Value>> {
    for (let node = this.head; node !== undefined; node = node?.next) {
      if (node) yield { key: node.key, value: node.value };
    }
  }

  /**
   * Iterate over cached keys from most recently used to least recently used.
   *
   * @returns An iterator of keys.
   */
  *keys(): IterableIterator<Key> {
    for (let node = this.head; node !== undefined; node = node?.next) {
      if (node) yield node.key;
    }
  }

  /**
   * Iterate over cached values from most recently used to least recently used.
   *
   * @returns An iterator of values.
   */
  *values(): IterableIterator<Value> {
    for (let node = this.head; node !== undefined; node = node?.next) {
      if (node) yield node.value;
    }
  }

  /**
   * Iterate over key-value pairs in MRU-to-LRU order.
   *
   * @returns An iterator of {@link Pair} values, equivalent to
   * {@link LruCache.entries}.
   */
  [Symbol.iterator](): IterableIterator<Pair<Key, Value>> {
    return this.entries();
  }

  /**
   * Number of entries currently in the cache.
   */
  get size(): number {
    return this.count;
  }
}
