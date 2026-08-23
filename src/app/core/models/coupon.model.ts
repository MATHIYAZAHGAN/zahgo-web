export interface Coupon {
  code: string;
  discountPercentage: number;
  maxDiscount?: number;
  minOrderAmount: number;
  description: string;
  expiryDate: string;
}
