import React from 'react';
import { Smartphone, Shield, Zap, Package, Receipt, CreditCard } from 'lucide-react';

interface BreakdownItem {
  devicePrice: number;
  boostProtect: number;
  setupCharge: number;
  bundlePrice: number;
  planPrice: number;
  subtotal: number;
  tax: number;
  total: number;
}

interface DetailedPriceBreakdownProps {
  breakdown: BreakdownItem;
}

const DetailedPriceBreakdown: React.FC<DetailedPriceBreakdownProps> = ({ breakdown }) => {
  return (
    <div className="text-xs text-[#ff6900] mt-2 space-y-2">
      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          <span>Device Price:</span>
        </div>
        <span>{breakdown.devicePrice !== null ? `$${breakdown.devicePrice.toFixed(2)}` : 'N/A'}</span>
      </div>
      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>Boost Protect:</span>
        </div>
        <span>{breakdown.boostProtect !== null ? `$${breakdown.boostProtect.toFixed(2)}` : 'N/A'}</span>
      </div>
      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          <span>Device Setup Charge:</span>
        </div>
        <span>{breakdown.setupCharge !== null ? `$${breakdown.setupCharge.toFixed(2)}` : 'N/A'}</span>
      </div>
      {breakdown.bundlePrice > 0 && (
        <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>Bundle Price:</span>
          </div>
          <span>{breakdown.bundlePrice !== null ? `$${breakdown.bundlePrice.toFixed(2)}` : 'N/A'}</span>
        </div>
      )}
      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4" />
          <span>Monthly Plan:</span>
        </div>
        <span>{breakdown.planPrice !== null ? `$${breakdown.planPrice.toFixed(2)}` : 'N/A'}</span>
      </div>
      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors bg-gray-50">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          <span>Subtotal:</span>
        </div>
        <span>{breakdown.subtotal !== null ? `$${breakdown.subtotal.toFixed(2)}` : 'N/A'}</span>
      </div>
      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors bg-gray-50">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4" />
          <span>Tax:</span>
        </div>
        <span>{breakdown.tax !== null ? `$${breakdown.tax.toFixed(2)}` : 'N/A'}</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-[#ff6900] bg-opacity-5 rounded-lg font-bold">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          <span>Total Due Today:</span>
        </div>
        <span>{breakdown.total !== null ? `$${breakdown.total.toFixed(2)}` : 'N/A'}</span>
      </div>
    </div>
  );
};

export default DetailedPriceBreakdown;