import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly DEFAULT_MENU_KEY = 'defaultMenuId';
  private readonly COOKIE_EXPIRY_DAYS = 365;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  setDefaultMenuId(menuId: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + this.COOKIE_EXPIRY_DAYS);
      document.cookie = `${
        this.DEFAULT_MENU_KEY
      }=${menuId};expires=${expiryDate.toUTCString()};path=/`;
    }
  }
  getDefaultMenuId(): number | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith(this.DEFAULT_MENU_KEY));
    if (cookie) {
      const value = parseInt(cookie.split('=')[1], 10);
      return isNaN(value) ? null : value;
    }
    return null;
  }
  clearDefaultMenuId(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = `${this.DEFAULT_MENU_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  }
}
