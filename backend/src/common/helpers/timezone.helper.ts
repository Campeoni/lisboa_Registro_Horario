import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeZoneHelper {
  private offsetMinutes: number;

  constructor() {
    // Default: UTC-3 (Argentina). Config via env var TIMEZONE_OFFSET in minutes.
    this.offsetMinutes = parseInt(process.env.TIMEZONE_OFFSET ?? '-180', 10);
  }

  /** Returns the start of today (00:00:00.000) in configured timezone, as UTC Date */
  getStartOfToday(): Date {
    const now = new Date();
    // Shift to local timezone — now.getTime() returns UTC epoch ms,
    // adding offsetMinutes moves it so UTC methods reflect local time
    const localDate = new Date(now.getTime() + this.offsetMinutes * 60000);
    localDate.setUTCHours(0, 0, 0, 0);
    // Shift back to UTC epoch
    return new Date(localDate.getTime() - this.offsetMinutes * 60000);
  }

  /** Returns the end of today (23:59:59.999) in configured timezone, as UTC Date */
  getEndOfToday(): Date {
    const now = new Date();
    const localDate = new Date(now.getTime() + this.offsetMinutes * 60000);
    localDate.setUTCHours(23, 59, 59, 999);
    return new Date(localDate.getTime() - this.offsetMinutes * 60000);
  }

  /**
   * Returns the start of a local date (00:00:00.000) in the configured timezone, as UTC Date.
   * @param dateStr Date string in YYYY-MM-DD format.
   * Example: ("2026-05-01", offset -180) → 2026-05-01T03:00:00.000Z
   */
  getStartOfLocalDay(dateStr: string): Date {
    const [y, m, d] = dateStr.split('-').map(Number);
    const utcDate = new Date(Date.UTC(y, m - 1, d));
    return new Date(utcDate.getTime() - this.offsetMinutes * 60000);
  }

  /**
   * Returns the end of a local date (23:59:59.999) in the configured timezone, as UTC Date.
   * @param dateStr Date string in YYYY-MM-DD format.
   * Example: ("2026-05-01", offset -180) → 2026-05-02T02:59:59.999Z
   */
  getEndOfLocalDay(dateStr: string): Date {
    const [y, m, d] = dateStr.split('-').map(Number);
    const utcDate = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
    return new Date(utcDate.getTime() - this.offsetMinutes * 60000);
  }

  /** Returns the current time in the configured timezone (just the offset) */
  getOffsetMinutes(): number {
    return this.offsetMinutes;
  }

  /**
   * Formats a Date as HH:mm:ss in the configured timezone.
   * Example: for UTC-3 at 18:00 UTC → "15:00:00"
   */
  getLocalTimeString(date: Date): string {
    const localMs = date.getTime() + this.offsetMinutes * 60000;
    const localDate = new Date(localMs);
    const hh = localDate.getUTCHours().toString().padStart(2, '0');
    const mm = localDate.getUTCMinutes().toString().padStart(2, '0');
    const ss = localDate.getUTCSeconds().toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  /**
   * Returns the date as YYYY-MM-DD in the configured timezone.
   * Example: for UTC-3 at 2026-05-18T01:00:00.000Z → "2026-05-17"
   */
  getLocalDateString(date: Date): string {
    const localMs = date.getTime() + this.offsetMinutes * 60000;
    const localDate = new Date(localMs);
    const y = localDate.getUTCFullYear();
    const m = (localDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const d = localDate.getUTCDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
