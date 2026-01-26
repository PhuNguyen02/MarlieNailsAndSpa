// Utility functions

/**
 * Format number to Vietnamese currency (VND)
 * @param amount - The amount to format
 * @returns Formatted string (e.g., "79.000 đ")
 */
export const formatVND = (amount: number | string): string => {
  if (typeof amount === 'string') {
    return amount
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('₫', 'đ')
}

/**
 * Format price range or single price
 * @param price - Price number or price range string
 * @param priceRange - Optional price range string
 * @returns Formatted price string
 */
export const formatPrice = (
  price?: number | string,
  priceRange?: string
): string => {
  if (priceRange) {
    return priceRange + ' đ'
  }
  if (typeof price === 'number') {
    return formatVND(price)
  }
  if (typeof price === 'string') {
    return price
  }
  return 'Liên hệ'
}

