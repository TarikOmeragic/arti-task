import { Injectable } from '@angular/core';

const STORAGE_PREFIX = 'arti.'

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  getItem<T>(key: string): T | null {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);

    if (!raw) return null;

    return JSON.parse(raw) as T;
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    localStorage.removeItem(STORAGE_PREFIX + key);
  }
  
}
