import React, { useState, useEffect } from 'react';
import { bundles, PLANS, calculatePayNowTotal } from '../../utils/pricing';
import { Package, CreditCard, Shield, Receipt, Calendar, Tag, Smartphone, Phone } from 'lucide-react';

interface PayNowBundleProps {
  phone: any;
  taxRate: number;
}

const PayNowBundle: React.FC<PayNowBundleProps> = ({ phone, taxRate }) => {
  const [selectedPlan, setSelectedPlan] = useState("$50");
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<'port' | 'non-port'>('port');

  // Parse available plans from phone data
  const availablePlans = (() => {
    let plans = [];
    try {
      if (typeof phone.available_plans === 'string') {
        plans = JSON.parse(phone.available_plans);
      } else if (Array.isArray(phone.available_plans)) {
        plans = phone.available_plans;
      }
    } catch (e) {
      console.error('Error parsing available_plans:', e);
      return [];
    }
    
    return plans
      .filter(p => p.type === 'port_in')
      .map(p => `$${p.price}`)
      .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
  })();

  // Set default plan if available
  useEffect(() => {
    if (availablePlans.includes("$50")) {
      setSelectedPlan("$50");
    } else if (availablePlans.length > 0) {
      setSelectedPlan(availablePlans[0]);
    }
  }, [availablePlans]);

  const bundle = selectedBundle ? bundles[selectedBundle] : null;

  // Get pricing directly from phone data with fallbacks
  const devicePrice = paymentType === 'port' ? 
    (phone.payNow?.port?.price || 0) : 
    (phone.payNow?.nonPort?.price || 0);
  const boostProtectPrice = phone.payLater?.boostProtect || 0;
  const planPrice = parseInt(selectedPlan.slice(1));
  const bundlePrice = bundle?.price || 0;

  // Calculate breakdown using the correct values
  const breakdown = calculatePayNowTotal(
    devicePrice,
    planPrice,
    boostProtectPrice,
    bundlePrice,
    taxRate
  );

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {/* Payment Type Selection */}
        <div className="col-span-2 bg-gray-50 p-2 rounded-lg">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPaymentType('port')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                paymentType === 'port'
                  ? 'bg-[#ff6900] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Phone className="w-4 h-4" />
              Port-In
              <span className="text-xs">
                ${(phone.payNow?.port?.price || 0).toFixed(2)}
              </span>
            </button>
            <button
              onClick={() => setPaymentType('non-port')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                paymentType === 'non-port'
                  ? 'bg-[#ff6900] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Non-Port
              <span className="text-xs">
                ${(phone.payNow?.nonPort?.price || 0).toFixed(2)}
              </span>
            </button>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="col-span-2">
          <label className="text-xs text-[#ff6900] mb-1 block font-medium">Plan:</label>
          <select 
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="w-full p-1.5 text-xs rounded border text-[#ff6900]"
          >
            {availablePlans.length > 0 ? (
              availablePlans.map(plan => (
                <option key={plan} value={plan}>{plan} Plan</option>
              ))
            ) : (
              Object.keys(PLANS).map(plan => (
                <option key={plan} value={plan}>{plan} Plan</option>
              ))
            )}
          </select>
        </div>

        {/* Bundle Selection */}
        <div className="col-span-2">
          <label className="text-xs text-[#ff6900] mb-1 block font-medium">Bundle:</label>
          <select 
            value={selectedBundle || ''}
            onChange={(e) => setSelectedBundle(e.target.value || null)}
            className="w-full p-1.5 text-xs rounded border text-[#ff6900]"
          >
            <option value="">No Bundle</option>
            {Object.entries(bundles).map(([key, bundle]) => (
              <option key={key} value={key}>
                {bundle.name} (${bundle.price.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {bundle && (
          <div className="col-span-2 bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <Package className="w-3 h-3 text-[#ff6900]" />
              <span className="text-xs font-medium text-[#ff6900]">Bundle Items:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {bundle.items.map((item, index) => (
                <span key={index} className="text-[10px] bg-white px-1.5 py-0.5 rounded-full text-gray-600">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="col-span-2 bg-gradient-to-r from-[#ff6900] to-yellow-400 p-2 rounded-lg">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-white flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Total Due Today
            </span>
            <span className="text-xs font-bold text-white">
              ${breakdown.total.toFixed(2)}
            </span>
          </div>
          <div className="bg-white p-1.5 rounded-lg space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-600">Device ({paymentType === 'port' ? 'Port-In' : 'Non-Port'}):</span>
              <span className="font-medium">${breakdown.devicePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-600">Setup:</span>
              <span className="font-medium">${breakdown.setupCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-600">Boost Protect:</span>
              <span className="font-medium">${breakdown.boostProtect.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium">${breakdown.planPrice.toFixed(2)}</span>
            </div>
            {bundle && (
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-600">Bundle:</span>
                <span className="font-medium">${breakdown.bundlePrice.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">${breakdown.tax.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayNowBundle;