export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
export const normalizePhone = (v) => String(v || '').replace(/[\s-]/g, '');
export const isPhone = (v) => /^\+?\d{7,15}$/.test(normalizePhone(v));
export const isPincode = (v) => /^\d{6}$/.test(String(v || '').trim());

/**
 * Values that become URL path segments (phone numbers, fee/salary note lines, schedule days,
 * pincodes) must not contain characters the web server rejects inside a path.
 */
export const isSafeKey = (v) => !/[\\/;%]/.test(String(v ?? ''));
export const UNSAFE_KEY_MESSAGE = 'This value cannot contain / \\ ; or % characters.';

export const isIsoDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(String(v || ''));
export const isFuture = (isoDate, todayIso) => isoDate > todayIso;

/** Positive money amount that fits DECIMAL(10,2). */
export const isMoney = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 && n < 100000000 && Math.round(n * 100) === Math.round(n * 100 + 0) && /^\d+(\.\d{1,2})?$/.test(String(v).trim());
};
