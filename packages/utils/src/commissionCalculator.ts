export interface CommissionResult {
  commissionRate: number;
  commissionAmount: number;
  vendorPayout: number;
}

export function calculateCommission(sellingPrice: number, plan: 'free' | 'silver' | 'gold', isFreeCommission: boolean = false): CommissionResult {
  if (isFreeCommission) {
    return {
      commissionRate: 0,
      commissionAmount: 0,
      vendorPayout: sellingPrice
    };
  }

  let rate = 15; // default free plan
  if (plan === 'silver') rate = 12;
  if (plan === 'gold') rate = 10;

  const commissionAmount = (sellingPrice * rate) / 100;
  
  return {
    commissionRate: rate,
    commissionAmount: parseFloat(commissionAmount.toFixed(2)),
    vendorPayout: parseFloat((sellingPrice - commissionAmount).toFixed(2))
  };
}
