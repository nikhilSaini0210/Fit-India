import { createMMKV } from 'react-native-mmkv';
import { QUEUE, STORAGE_KEYS, type StorageKey } from '../constants';
import { CacheEntry, OfflineRequest } from './interface';

export const storage = createMMKV({
  id: STORAGE_KEYS.STORE_ID,
  // encryptionKey: STORAGE_KEYS.STORE_KEY, // ← enable in production
});

export function setItem<T>(key: StorageKey, value: T): void {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[MMKV] setItem failed for key "${key}":`, e);
  }
}

export function getItem<T>(key: StorageKey): T | null {
  try {
    const raw = storage.getString(key);
    if (raw === undefined || raw === null) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`[MMKV] getItem failed for key "${key}":`, e);
    return null;
  }
}

export function removeItem(key: StorageKey): void {
  storage.remove(key);
}

export function clearAll(): void {
  storage.clearAll();
}

export function setCached<T>(key: StorageKey, data: T, ttl: number): void {
  const entry: CacheEntry<T> = {
    data,
    expiresAt: Date.now() + ttl,
  };
  setItem(key, entry);
}

export function getCached<T>(key: StorageKey, forceRefresh = false): T | null {
  const entry = getItem<CacheEntry<T>>(key);
  if (!entry) return null;
  if (!forceRefresh && Date.now() > entry.expiresAt) {
    removeItem(key);
    return null;
  }
  return entry.data;
}

export function isCacheValid(key: StorageKey): boolean {
  const entry = getItem<CacheEntry<unknown>>(key);
  if (!entry) return false;
  return Date.now() <= entry.expiresAt;
}

export function invalidateCache(key: StorageKey): void {
  removeItem(key);
}

const OFFLINE_KEY = STORAGE_KEYS.OFFLINE_QUEUE as StorageKey;
const MAX_QUEUE = QUEUE.OFFLINE_MAX_QUEUE;

export function enqueueOffline(req: OfflineRequest): void {
  const existing = getItem<OfflineRequest[]>(OFFLINE_KEY) ?? [];
  setItem(OFFLINE_KEY, [...existing, req].slice(-MAX_QUEUE));
}

export function dequeueAll(): OfflineRequest[] {
  const queue = getItem<OfflineRequest[]>(OFFLINE_KEY) ?? [];
  removeItem(OFFLINE_KEY);
  return queue;
}

export const zustandMMKVStorage = {
  getItem: (name: string): string | null => {
    return storage.getString(name) ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

export const RawTokens = {
  getAccess: (): string | null =>
    storage.getString(STORAGE_KEYS.ACCESS_TOKEN) ?? null,
  getRefresh: (): string | null =>
    storage.getString(STORAGE_KEYS.REFRESH_TOKEN) ?? null,
  set: (a: string, r: string) => {
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, a);
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, r);
  },
  clear: () => {
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  },
};

export const OnboardingStorage = {
  isComplete: (): boolean =>
    storage.getBoolean(STORAGE_KEYS.ONBOARDING_DONE) ?? false,
  markComplete: (): void => storage.set(STORAGE_KEYS.ONBOARDING_DONE, true),
  reset: (): void => {
    storage.remove(STORAGE_KEYS.ONBOARDING_DONE);
  },
};
