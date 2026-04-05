// Simple nanoid-like unique ID generator (no extra dependency needed)
export function nanoid(size = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(size);
  if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(randomValues);
    randomValues.forEach((v) => (result += chars[v % chars.length]));
  } else {
    for (let i = 0; i < size; i++) result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
