class CacheService {
    constructor() {
        this.memoryCache = new Map();
        this.persistentCache = new Map();
        this.cacheConfig = {
            maxMemorySize: 50 * 1024 * 1024,
            maxPersistentSize: 100 * 1024 * 1024,
            defaultTTL: 5 * 60 * 1000,
            maxAge: 24 * 60 * 60 * 1000,
            cleanupInterval: 10 * 60 * 1000
        };
        this.currentMemorySize = 0;
        this.currentPersistentSize = 0;
        this.initializePersistentCache();
        this.startCleanupTimer();
    }
    initializePersistentCache() {
        try {
            const stored = localStorage.getItem('team_pulse_cache');
            if (stored) {
                const parsed = JSON.parse(stored);
                Object.entries(parsed).forEach(([key, value]) => {
                    if (this.isValidCacheEntry(value)) {
                        this.persistentCache.set(key, value);
                        this.currentPersistentSize += this.calculateSize(value);
                    }
                });
            }
        } catch (error) {
            console.warn('Failed to initialize persistent cache:', error);
            localStorage.removeItem('team_pulse_cache');
        }
    }
    savePersistentCache() {
        try {
            const cacheObject = Object.fromEntries(this.persistentCache);
            localStorage.setItem('team_pulse_cache', JSON.stringify(cacheObject));
        } catch (error) {
            console.warn('Failed to save persistent cache:', error);
            this.cleanupPersistentCache(0.5);
            try {
                const cacheObject = Object.fromEntries(this.persistentCache);
                localStorage.setItem('team_pulse_cache', JSON.stringify(cacheObject));
            } catch (retryError) {
                console.error('Failed to save cache after cleanup:', retryError);
            }
        }
    }
    calculateSize(data) {
        return JSON.stringify(data).length * 2;
    }
    isValidCacheEntry(entry) {
        return entry &&
            typeof entry === 'object' &&
            entry.data !== undefined &&
            entry.timestamp &&
            entry.ttl !== undefined;
    }
    setMemory(key, data, options = {}) {
        const {
            ttl = this.cacheConfig.defaultTTL,
                tags = [],
                priority = 1
        } = options;
        const entry = {
            data,
            timestamp: Date.now(),
            ttl,
            tags,
            priority,
            accessCount: 0,
            lastAccessed: Date.now()
        };
        const size = this.calculateSize(entry);
        if (this.currentMemorySize + size > this.cacheConfig.maxMemorySize) {
            this.evictMemoryCache(size);
        }
        this.memoryCache.set(key, entry);
        this.currentMemorySize += size;
    }
    getMemory(key) {
        const entry = this.memoryCache.get(key);
        if (!entry) return null;
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.deleteMemory(key);
            return null;
        }
        entry.accessCount++;
        entry.lastAccessed = Date.now();
        return entry.data;
    }
    deleteMemory(key) {
        const entry = this.memoryCache.get(key);
        if (entry) {
            this.currentMemorySize -= this.calculateSize(entry);
            this.memoryCache.delete(key);
        }
    }
    setPersistent(key, data, options = {}) {
        const {
            ttl = this.cacheConfig.maxAge,
                tags = [],
                priority = 1
        } = options;
        const entry = {
            data,
            timestamp: Date.now(),
            ttl,
            tags,
            priority,
            accessCount: 0,
            lastAccessed: Date.now()
        };
        const size = this.calculateSize(entry);
        if (this.currentPersistentSize + size > this.cacheConfig.maxPersistentSize) {
            this.evictPersistentCache(size);
        }
        this.persistentCache.set(key, entry);
        this.currentPersistentSize += size;
        this.savePersistentCache();
    }
    getPersistent(key) {
        const entry = this.persistentCache.get(key);
        if (!entry) return null;
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.deletePersistent(key);
            return null;
        }
        entry.accessCount++;
        entry.lastAccessed = Date.now();
        return entry.data;
    }
    deletePersistent(key) {
        const entry = this.persistentCache.get(key);
        if (entry) {
            this.currentPersistentSize -= this.calculateSize(entry);
            this.persistentCache.delete(key);
            this.savePersistentCache();
        }
    }
    set(key, data, options = {}) {
        const { persistent = false } = options;
        if (persistent) {
            this.setPersistent(key, data, options);
        } else {
            this.setMemory(key, data, options);
        }
    }
    get(key, options = {}) {
        const { persistent = false, fallbackToPersistent = true } = options;
        if (persistent) {
            return this.getPersistent(key);
        }
        let data = this.getMemory(key);
        if (data === null && fallbackToPersistent) {
            data = this.getPersistent(key);
            if (data !== null) {
                this.setMemory(key, data, { ttl: this.cacheConfig.defaultTTL });
            }
        }
        return data;
    }
    delete(key) {
        this.deleteMemory(key);
        this.deletePersistent(key);
    }
    async getOrFetch(key, fetchFn, options = {}) {
        const {
            persistent = false,
                staleWhileRevalidate = false,
                backgroundRefresh = false
        } = options;
        let cachedData = this.get(key, { persistent });
        if (cachedData !== null) {
            if (staleWhileRevalidate && this.isStale(key, options)) {
                if (backgroundRefresh) {
                    this.refreshInBackground(key, fetchFn, options);
                }
            }
            return cachedData;
        }
        try {
            const freshData = await fetchFn();
            this.set(key, freshData, options);
            return freshData;
        } catch (error) {
            const staleData = this.get(key, { persistent: true });
            if (staleData !== null) {
                console.warn(`Fetch failed for ${key}, returning stale data:`, error);
                return staleData;
            }
            throw error;
        }
    }
    isStale(key, options = {}) {
        const { persistent = false, staleThreshold = this.cacheConfig.defaultTTL * 0.8 } = options;
        const cache = persistent ? this.persistentCache : this.memoryCache;
        const entry = cache.get(key);
        if (!entry) return true;
        return Date.now() - entry.timestamp > staleThreshold;
    }
    async refreshInBackground(key, fetchFn, options = {}) {
        try {
            const freshData = await fetchFn();
            this.set(key, freshData, options);
        } catch (error) {
            console.warn(`Background refresh failed for ${key}:`, error);
        }
    }
    evictMemoryCache(requiredSize) {
        const entries = Array.from(this.memoryCache.entries());
        entries.sort(([, a], [, b]) => {
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            return a.lastAccessed - b.lastAccessed;
        });
        let freedSize = 0;
        for (const [key, entry] of entries) {
            if (freedSize >= requiredSize) break;
            freedSize += this.calculateSize(entry);
            this.deleteMemory(key);
        }
    }
    evictPersistentCache(requiredSize) {
        const entries = Array.from(this.persistentCache.entries());
        entries.sort(([, a], [, b]) => {
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            const aScore = a.accessCount / (Date.now() - a.timestamp);
            const bScore = b.accessCount / (Date.now() - b.timestamp);
            return aScore - bScore;
        });
        let freedSize = 0;
        for (const [key, entry] of entries) {
            if (freedSize >= requiredSize) break;
            freedSize += this.calculateSize(entry);
            this.deletePersistent(key);
        }
    }
    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.memoryCache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.deleteMemory(key);
            }
        }
        let persistentChanged = false;
        for (const [key, entry] of this.persistentCache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.deletePersistent(key);
                persistentChanged = true;
            }
        }
        if (persistentChanged) {
            this.savePersistentCache();
        }
    }
    cleanupPersistentCache(ratio = 0.3) {
        const entries = Array.from(this.persistentCache.entries());
        const toRemove = Math.floor(entries.length * ratio);
        entries.sort(([, a], [, b]) => {
            const aScore = a.accessCount / (Date.now() - a.timestamp);
            const bScore = b.accessCount / (Date.now() - b.timestamp);
            return aScore - bScore;
        });
        for (let i = 0; i < toRemove; i++) {
            const [key] = entries[i];
            this.deletePersistent(key);
        }
    }
    startCleanupTimer() {
        setInterval(() => {
            this.cleanup();
        }, this.cacheConfig.cleanupInterval);
    }
    getStats() {
        return {
            memory: {
                size: this.currentMemorySize,
                entries: this.memoryCache.size,
                maxSize: this.cacheConfig.maxMemorySize,
                utilization: (this.currentMemorySize / this.cacheConfig.maxMemorySize) * 100
            },
            persistent: {
                size: this.currentPersistentSize,
                entries: this.persistentCache.size,
                maxSize: this.cacheConfig.maxPersistentSize,
                utilization: (this.currentPersistentSize / this.cacheConfig.maxPersistentSize) * 100
            }
        };
    }
    clear() {
        this.memoryCache.clear();
        this.persistentCache.clear();
        this.currentMemorySize = 0;
        this.currentPersistentSize = 0;
        localStorage.removeItem('team_pulse_cache');
    }
    clearByTags(tags) {
        const tagsSet = new Set(Array.isArray(tags) ? tags : [tags]);
        for (const [key, entry] of this.memoryCache.entries()) {
            if (entry.tags.some(tag => tagsSet.has(tag))) {
                this.deleteMemory(key);
            }
        }
        let persistentChanged = false;
        for (const [key, entry] of this.persistentCache.entries()) {
            if (entry.tags.some(tag => tagsSet.has(tag))) {
                this.deletePersistent(key);
                persistentChanged = true;
            }
        }
        if (persistentChanged) {
            this.savePersistentCache();
        }
    }
}
const cacheService = new CacheService();
export default cacheService;
export const createCacheKey = (...parts) => {
    return parts.filter(Boolean).join(':');
};
export const withCache = (cacheKey, options = {}) => {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function(...args) {
            const key = typeof cacheKey === 'function' ? cacheKey(...args) : cacheKey;
            return cacheService.getOrFetch(key, () => originalMethod.apply(this, args), options);
        };
        return descriptor;
    };
};
export { CacheService };
