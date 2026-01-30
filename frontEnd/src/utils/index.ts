// Utility functions

/**
 * Format number to Vietnamese currency (VND)
 * @param amount - The amount to format
 * @returns Formatted string (e.g., "79.000 đ")
 */
export const formatVND = (amount: number | string): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) {
    return typeof amount === "string" ? amount : "0 VNĐ";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(num)
    .replace("₫", "VNĐ")
    .replace(/\s/g, " "); // Ensure standard space
};

/**
 * Format price range or single price
 * @param price - Price number or price range string
 * @param priceRange - Optional price range string
 * @returns Formatted price string
 */
export const formatPrice = (
  price?: number | string,
  priceRange?: string,
): string => {
  if (priceRange) {
    // If priceRange already contains 'đ', don't add another one
    if (
      priceRange.includes("VNĐ") ||
      priceRange.includes("VND") ||
      priceRange.includes("đ")
    ) {
      return priceRange.replace("đ", "VNĐ");
    }
    return priceRange + " VNĐ";
  }
  if (price !== undefined && price !== null && price !== "") {
    return formatVND(price);
  }
  return "Liên hệ";
};
