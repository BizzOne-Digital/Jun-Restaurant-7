export function generateOrderNumber(): string {
  const part = Math.random().toString(36).slice(2, 8).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase().slice(-4);
  return `ONO-${ts}${part}`;
}
