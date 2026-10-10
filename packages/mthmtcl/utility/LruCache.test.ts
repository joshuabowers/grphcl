import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { LruCache } from "./LruCache.ts";

describe("LruCache", () => {
  describe("constructor", () => {
    it("throws on a negative limit", () => {
      expect(() => new LruCache(-1)).toThrow();
    });

    it("throws on a 0 limit", () => {
      expect(() => new LruCache(0)).toThrow();
    });

    it("does not throw on a positive limit", () => {
      expect(() => new LruCache(1)).not.toThrow();
    });
  });

  describe("get", () => {
    it("is undefined for an empty cache", () => {
      expect(new LruCache<number, unknown>(1).get(1)).toBeUndefined();
    });

    it("is the exact object if present", () => {
      const item1 = { k: 1 };
      const cache = new LruCache<number, typeof item1>(1);
      cache.set(1, item1);
      expect(cache.get(1)).toBe(item1);
    });

    it("is undefined if the key was evicted", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(1);
      cache.set(1, item1).set(2, item2);
      expect(cache.get(1)).toBeUndefined();
    });

    it("updates the MRU to the key", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(2);
      cache.set(1, item1).set(2, item2);
      cache.get(1);
      expect([...cache.keys()][0]).toBe(1);
    });
  });

  describe("set", () => {
    it("is the cache it was invoked on", () => {
      const item = { k: 1 };
      const expected = new LruCache<number, typeof item>(1);
      const actual = expected.set(1, item);
      expect(actual).toBe(expected);
    });

    it("adds a value to the given key", () => {
      const item = { k: 1 };
      const cache = new LruCache<number, typeof item>(1);
      cache.set(1, item);
      expect(cache.get(1)).toBe(item);
    });

    it("updates a preexisting key", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(1);
      cache.set(1, item1).set(1, item2);
      expect(cache.get(1)).not.toBe(item1);
      expect(cache.get(1)).toBe(item2);
    });

    it("updates the MRU to the new pair", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(2);
      cache.set(1, item1).set(2, item2);
      expect(cache.keys().next().value).toBe(2);
    });
  });

  describe("clear", () => {
    it("reduces size to 0", () => {
      const item = { k: 1 };
      const cache = new LruCache<number, typeof item>(1);
      cache.set(1, item);
      cache.clear();
      expect(cache.size).toBe(0);
    });

    it("removes all keys from the cache", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(2);
      cache.set(1, item1).set(2, item2);
      cache.clear();
      expect([...cache.keys()]).toEqual([]);
    });

    it("removes all values from the cache", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(2);
      cache.set(1, item1).set(2, item2);
      cache.clear();
      expect([...cache.values()]).toEqual([]);
    });
  });

  describe("delete", () => {
    it("is false for an empty cache", () => {
      expect(new LruCache<number, unknown>(1).delete(1)).toBeFalsy();
    });

    it("is false if the key is not present", () => {
      const item = { k: 1 };
      const cache = new LruCache<number, typeof item>(1);
      cache.set(1, item);
      expect(cache.delete(2)).toBeFalsy();
    });

    it("is false for previously evicted keys", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(1);
      cache.set(1, item1).set(2, item2);
      expect(cache.delete(1)).toBeFalsy();
    });

    it("is true if the key was removed", () => {
      const item = { k: 1 };
      const cache = new LruCache<number, typeof item>(1);
      cache.set(1, item);
      expect(cache.delete(1)).toBeTruthy();
    });
  });

  describe("has", () => {
    it("is false for an empty cache", () => {
      const item = { k: 1 };
      expect(new LruCache<number, typeof item>(1).has(1)).toBeFalsy();
    });

    it("is true if a key is in the cache", () => {
      const item = { k: 1 };
      const cache = new LruCache<number, typeof item>(1);
      expect(cache.set(1, item).has(1)).toBeTruthy();
    });

    it("is false if a key is not in the cache", () => {
      expect(new LruCache<number, unknown>(1).has(1)).toBeFalsy();
    });

    it("is false if a key is evicted", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(1);
      expect(cache.set(1, item1).set(2, item2).has(1)).toBeFalsy();
    });
  });

  describe("entries", () => {
    it("is empty on a fresh cache", () => {
      expect([...new LruCache(1).entries()]).toEqual([]);
    });

    it("contains key, value pairs currently in cache", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(2);
      cache.set(1, item1).set(2, item2);
      expect([...cache.entries()]).toEqual([
        { key: 2, value: item2 },
        { key: 1, value: item1 },
      ]);
    });

    it("does not contain evicted entries", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(1);
      cache.set(1, item1).set(2, item2);
      expect([...cache.entries()]).toEqual([{ key: 2, value: item2 }]);
    });

    it("returns entries in the order of MRU to LRU", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(2);
      cache.set(1, item1).set(2, item2);
      cache.get(1);
      expect([...cache.entries()]).toEqual([
        { key: 1, value: item1 },
        { key: 2, value: item2 },
      ]);
    });
  });

  describe("keys", () => {
    it("is empty on a fresh cache", () => {
      expect([...new LruCache(1).keys()]).toEqual([]);
    });

    it("contains keys currently in cache", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(2);
      cache.set(1, item1).set(2, item2);
      expect([...cache.keys()]).toEqual([2, 1]);
    });

    it("does not contain evicted keys", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(1);
      cache.set(1, item1).set(2, item2);
      expect([...cache.keys()]).toEqual([2]);
    });

    it("returns keys in the order of MRU to LRU", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(2);
      cache.set(1, item1).set(2, item2);
      cache.get(1);
      expect([...cache.keys()]).toEqual([1, 2]);
    });

    it("maintains order for complex operations", () => {
      const items = Array(10).fill(0).map((_v, k) => ({
        key: k,
        value: { k },
      }));
      const cache = new LruCache<number, { k: number }>(10);
      for (const { key, value } of items) {
        cache.set(key, value);
      }
      cache.get(1);
      cache.get(5);
      expect([...cache.keys()]).toEqual([5, 1, 9, 8, 7, 6, 4, 3, 2, 0]);
      cache.set(10, { k: 10 }).set(11, { k: 11 });
      expect([...cache.keys()]).toEqual([11, 10, 5, 1, 9, 8, 7, 6, 4, 3]);
    });
  });

  describe("values", () => {
    it("is empty on a fresh cache", () => {
      expect([...new LruCache(1).values()]).toEqual([]);
    });

    it("contains values currently in cache", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(2);
      cache.set(1, item1).set(2, item2);
      expect([...cache.values()]).toEqual([item2, item1]);
    });

    it("does not contain evicted values", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(1);
      cache.set(1, item1).set(2, item2);
      expect([...cache.values()]).toEqual([item2]);
    });

    it("returns values in the order of MRU to LRU", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(2);
      cache.set(1, item1).set(2, item2);
      cache.get(1);
      expect([...cache.values()]).toEqual([item1, item2]);
    });
  });

  describe("size", () => {
    it("is 0 for a fresh cache", () => {
      expect(new LruCache(1).size).toBe(0);
    });

    it("is 1 after adding an item", () => {
      const item = { k: 1 };
      const cache = new LruCache<number, typeof item>(1);
      cache.set(1, item);
      expect(cache.size).toBe(1);
    });

    it("is the limit if adding past limit", () => {
      const item1 = { k: 1 }, item2 = { k: 2 };
      const cache = new LruCache<number, typeof item1>(1);
      cache.set(1, item1).set(2, item2);
      expect(cache.size).toBe(cache.limit);
    });

    it("decreases on deletion", () => {
      const item = { k: 1 };
      const cache = new LruCache<number, typeof item>(1);
      cache.set(1, item);
      cache.delete(1);
      expect(cache.size).toBe(0);
    });
  });
});
