import {Injectable} from '@angular/core';

interface CachedItem<T> {
  value: T;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private readonly CACHE_DURATION_MS = 5 * 1000; // 5 seconds
  // private readonly CACHE_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours
  private cacheKey = 'cache';
  
  // Get cached value by key
  get<T>(key: string): T | undefined {
    const cache = this.getCache();
    const cachedItem = cache[key];
    
    if (!cachedItem) {
      console.log(`no cache for key:'${key}'`);
      return undefined;
    }
    const cacheExpired = cachedItem.expiresAt < Date.now();
    if (cachedItem && !cacheExpired) {
      console.log(`cache hit for key:'${key}'`, cachedItem);
      //return cached value
      return cachedItem.value as T;
    } else {
      if (cacheExpired) {
        console.log(`cache expired for key:'${key}'`);
      }
      // return undefined if cache is expired or empty
      return undefined;
    }
  }
  
  set<T>(key: string, value: T): void {
    const expiresAt = Date.now() + (this.CACHE_DURATION_MS);
    const cache = this.getCache();
    cache[key] = {value, expiresAt};
    this.saveCache(cache);
  }
  
  // Read from the cache store (localstorage)
  private getCache<T>(): { [key: string]: CachedItem<T> } {
    const cache = localStorage.getItem(this.cacheKey);
    const parsedCache = JSON.parse(cache) as { [key: string]: CachedItem<T> };
    return cache ? parsedCache : {};
  }
  
  // Save to the cache store (localstorage)
  private saveCache<T>(cache: { [key: string]: CachedItem<T> }): void {
    localStorage.setItem(this.cacheKey, JSON.stringify(cache));
  }
}
