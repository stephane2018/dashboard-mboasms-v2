import { STORAGE_KEY_NAME } from "@/core/config/constante";

export class LocalStorageAdapter {
  private storage: Storage | null = null;
  private readonly prefix: string;

  constructor() {
    this.prefix = `${STORAGE_KEY_NAME}-`;
    this.initializeStorage();
  }

  private initializeStorage(): void {
    if (typeof window !== "undefined") {
      this.storage = window.localStorage;
    }
  }

  private getStorage(): Storage {
    if (!this.storage) {
      this.initializeStorage();
    }
    if (!this.storage) {
      throw new Error("localStorage is not available in this environment");
    }
    return this.storage;
  }

  /**
   * Checks if a key exists in localStorage
   * @param key The key to check
   * @returns boolean indicating if the key exists and has a value
   */
  public exist(key: string): boolean {
    const storage = this.getStorage();
    const value = storage.getItem(this.prefix + key);
    return value !== null && value !== "undefined";
  }

  /**
   * Retrieves a JSON value from localStorage
   * @param key The key of the value to retrieve
   * @returns The parsed JSON value or null if not found
   */
  public getJson<T = object>(key: string): T | null {
    if (!this.exist(key)) {
      return null;
    }
    const storage = this.getStorage();
    const value = storage.getItem(this.prefix + key);
    return value ? JSON.parse(value) : null;
  }

  /**
   * Stores a JSON value in localStorage
   * @param key The key under which to store the value
   * @param data The data to store (will be JSON stringified)
   */
  public setJson(key: string, data: unknown): void {
    const storage = this.getStorage();
    storage.setItem(this.prefix + key, JSON.stringify(data));
  }

  /**
   * Retrieves a string value from localStorage
   * @param key The key of the value to retrieve
   * @returns The string value or null if not found
   */
  public get<T = string>(key: string): T | null {
    if (!this.exist(key)) {
      return null;
    }
    const storage = this.getStorage();
    return storage.getItem(this.prefix + key) as unknown as T;
  }

  /**
   * Stores a string value in localStorage
   * @param key The key under which to store the value
   * @param data The data to store
   */
  public set(key: string, data: string): void {
    const storage = this.getStorage();
    storage.setItem(this.prefix + key, data);
  }

  /**
   * Removes a key-value pair from localStorage
   * @param key The key to remove
   */
  public remove(key: string): void {
    const storage = this.getStorage();
    storage.removeItem(this.prefix + key);
  }

  /**
   * Clears all items from localStorage (including those without the prefix)
   */
  public clear(): void {
    const storage = this.getStorage();
    storage.clear();
  }
}

export const localStorageAdapter = new LocalStorageAdapter();
