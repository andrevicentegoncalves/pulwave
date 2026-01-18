/**
 * Cache Provider Interface
 * Standard contract for all cache implementations (Memory, Redis, etc.)
 */
export interface ICacheProvider {
    /**
     * Get a value from the cache
     * @param key Cache key
     */
    get<T>(key: string): Promise<T | null>;

    /**
     * Set a value in the cache
     * @param key Cache key
     * @param value Value to store
     * @param ttl Time to live in milliseconds (optional)
     */
    set<T>(key: string, value: T, ttl?: number): Promise<void>;

    /**
     * Delete a value from the cache
     * @param key Cache key
     */
    del(key: string): Promise<void>;

    /**
     * Invalidate keys matching a pattern
     * @param pattern Key pattern (e.g., "user:*")
     */
    invalidatePattern(pattern: string): Promise<void>;

    /**
     * Clear the entire cache (Use with caution)
     */
    clear(): Promise<void>;

    /**
     * Check if a key exists in the cache
     * @param key Cache key
     */
    has(key: string): Promise<boolean>;
}
