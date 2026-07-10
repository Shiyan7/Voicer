export function formatPrice(price?: number): string {
  if (!price) return '0K';

  const thousands = price / 1000;

  if (thousands >= 1000) {
    const formatted = Math.floor(thousands)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return `${formatted}K`;
  }

  return `${thousands}K`;
}
