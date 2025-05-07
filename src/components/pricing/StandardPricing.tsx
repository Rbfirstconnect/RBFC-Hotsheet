import React from 'react';
import { CreditCard, Phone, Smartphone, Gift, Package, Zap, Shield, Receipt } from 'lucide-react';

interface StandardPricingProps {
  phone: any;
  taxRate: number;
}

const StandardPricing: React.FC<StandardPricingProps> = ({ phone, taxRate }) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {/* Pay Now Section */}
        <div className="col-span-2 bg-gradient-to-r from-[#ff6900] to-yellow-400 p-2 rounded-lg">
          <h3 className="text-xs font-medium mb-2 text-white flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            Pay Now
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="col-span-2 bg-white p-2 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#ff6900]" />
                  <span className="text-xs font-medium text-[#ff6900]">Port-In</span>
                </div>
                <span className="text-xs font-bold text-[#ff6900]">
                  {typeof phone.payNow?.port?.price === 'number' ? 
                    (phone.payNow.port.price === 0 ? 'FREE' : 
                    `$${phone.payNow.port.price.toFixed(2)}`) : 'N/A'}
                </span>
              </div>
              <div className="flex gap-1 mt-1 flex-wrap">
                {Array.isArray(phone.payNow?.port?.plans) && phone.payNow.port.plans.map((plan: string) => (
                  <span key={plan} className="text-[10px] bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded-full">
                    {plan}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-[#ff6900]" />
                  <span className="text-xs font-medium text-[#ff6900]">Non-Port</span>
                </div>
                <span className="text-xs font-bold text-[#ff6900]">
                  {typeof phone.payNow?.nonPort?.price === 'number' ? 
                    `$${phone.payNow.nonPort.price.toFixed(2)}` : 'N/A'}
                </span>
              </div>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#ff6900]" />
                  <span className="text-xs font-medium text-[#ff6900]">Upgrade</span>
                </div>
                <span className="text-xs font-bold text-[#ff6900]">
                  {typeof phone.payNow?.upgrade === 'number' ? 
                    `$${phone.payNow.upgrade.toFixed(2)}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pay Later Section */}
        <div className="col-span-2 bg-gradient-to-r from-yellow-400 to-[#ff6900] p-2 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-medium text-white flex items-center gap-1">
              <Package className="w-3 h-3" />
              Pay Later
            </h3>
            <span className="text-[10px] font-medium text-white flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {typeof phone.payLater?.monthlyPrice === 'number' ? 
                `$${phone.payLater.monthlyPrice.toFixed(2)}/mo` : 'N/A'}
            </span>
          </div>
          <div className="grid gap-1.5">
            {phone.payLater?.plans && Object.entries(phone.payLater.plans).map(([plan, details]: [string, any]) => (
              <div key={plan} className="bg-white p-2 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Receipt className="w-3 h-3 text-[#ff6900]" />
                    <span className="text-xs text-[#ff6900]">{plan}</span>
                  </div>
                  <span className="text-xs font-medium text-[#ff6900]">
                    {typeof details?.total === 'number' ? 
                      `$${((details.total + (details.total * taxRate))).toFixed(2)}/mo` : 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardPricing;