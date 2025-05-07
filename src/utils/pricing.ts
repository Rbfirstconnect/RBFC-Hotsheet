// Constants for pricing calculations
export const DEVICE_SETUP_CHARGE = 35;
export const PLANS = {
  "$25": 25,
  "$40": 40,
  "$50": 50,
  "$60": 60
};

export const ALL_PLANS = ["$25", "$50", "$60"];

export const bundles = {
  tier1: { name: "Tier 1", price: 35, items: ["Charging Block", "Screen Protector"] },
  tier2: { name: "Tier 2", price: 45, items: ["Case", "Screen Protector"] },
  tier3: { name: "Tier 3", price: 60, items: ["Screen Protector", "Case", "Power Block"] },
  tier4: { name: "Tier 4", price: 100, items: ["Screen Protector", "Case", "Power Block", "Base Audio Headphone/Speaker"] }
};

// Utility functions for price calculations
export const calculateTax = (amount: number, taxRate: number): number => amount * taxRate;

export const calculatePayNowTotal = (
  phonePrice: number, 
  planPrice: number, 
  boostProtect: number, 
  bundlePrice = 0, 
  taxRate: number
) => {
  // Ensure all values are numbers and not undefined/null
  const validPhonePrice = phonePrice || 0;
  const validPlanPrice = planPrice || 0;
  const validBoostProtect = boostProtect || 0;
  const validBundlePrice = bundlePrice || 0;

  // Calculate tax for device and bundle only
  const deviceAndBundleTax = calculateTax(validPhonePrice + validBundlePrice, taxRate);
  
  // Calculate total
  const total = validPhonePrice + // Device price
                DEVICE_SETUP_CHARGE + // Setup charge
                validBoostProtect + // Boost protect
                validPlanPrice + // Plan price
                validBundlePrice + // Bundle price
                deviceAndBundleTax; // Tax

  return {
    devicePrice: validPhonePrice,
    setupCharge: DEVICE_SETUP_CHARGE,
    bundlePrice: validBundlePrice,
    boostProtect: validBoostProtect,
    planPrice: validPlanPrice,
    subtotal: validPhonePrice + DEVICE_SETUP_CHARGE + validBoostProtect + validPlanPrice + validBundlePrice,
    tax: deviceAndBundleTax,
    total: total
  };
};

export const calculatePayLaterTotal = (
  monthlyPrice: number, 
  boostProtect: number, 
  selectedPlan: string, 
  taxRate: number
) => {
  const planPrice = PLANS[selectedPlan] || 0;
  return {
    deviceOnly: monthlyPrice,
    boostProtect,
    planPrice,
    tax: calculateTax(monthlyPrice * 24, taxRate) / 24,
    total: monthlyPrice + boostProtect + planPrice + (calculateTax(monthlyPrice * 24, taxRate) / 24)
  };
};

export const calculatePayLaterDueToday = (
  monthlyPrice: number, 
  srp: number, 
  bundlePrice = 0, 
  taxRate: number
) => {
  const deviceTax = calculateTax(srp, taxRate);
  const bundleTax = calculateTax(bundlePrice, taxRate);
  const taxableTotal = monthlyPrice + DEVICE_SETUP_CHARGE + bundlePrice;
  
  return {
    deviceFinancePrice: monthlyPrice,
    setupCharge: DEVICE_SETUP_CHARGE,
    deviceTax,
    bundlePrice,
    bundleTax,
    total: taxableTotal + deviceTax + bundleTax
  };
};