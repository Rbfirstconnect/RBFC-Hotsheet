import React, { useState, useEffect } from 'react';
import { bundles, PLANS, calculatePayLaterTotal, calculatePayLaterDueToday } from '../../utils/pricing';
import { Package, CreditCard, Shield, Receipt, Calendar, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PhoneData {
  id: string;
  name: string;
  brand: string;
  color: string;
  storage: string;
  screen_size: number;
  srp: number;
  image_url: string;
  port_in_price: number;
  non_port_price: number;
  upgrade_price: number;
  monthly_price: number;
  boost_protect: number;
  available_plans: string | string[];
  promotion_type: string;
  promotion_text: string;
  promotion_valid_from: string;
  promotion_valid_to: string;
  specifications: string;
  created_at: string;
  updated_at: string;
}

interface PayLaterBundleProps {
  phoneId: string;
  taxRate: number;
}

const PayLaterBundle: React.FC<PayLaterBundleProps> = ({ phoneId, taxRate }) => {
  const [phoneData, setPhoneData] = useState<PhoneData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("$50");
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);

  // Fetch phone data from Supabase
  useEffect(() => {
    const fetchPhoneData = async () => {
      // Validate phoneId before making the request
      if (!phoneId || phoneId === 'undefined') {
        setError('Invalid phone ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('phone_details')
          .select('*')
          .eq('id', phoneId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setPhoneData(data);
          // Set default plan
          const plans = parseAvailablePlans(data.available_plans);
          setSelectedPlan(plans.includes("$50") ? "$50" : plans[0] || "$60");
        } else {
          setError('Phone not found');
        }
      } catch (err) {
        console.error('Error fetching phone data:', err);
        setError('Failed to load phone details');
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneData();
  }, [phoneId]);

  const parseAvailablePlans = (plans: any) => {
    let parsedPlans = [];
    try {
      if (typeof plans === 'string') {
        parsedPlans = JSON.parse(plans);
      } else if (Array.isArray(plans)) {
        parsedPlans = plans;
      }
    } catch (e) {
      console.error('Error parsing available_plans:', e);
      return [];
    }
    
    return parsedPlans
      .filter((p: any) => p.type === 'pay_later')
      .map((p: any) => `$${p.price}`)
      .sort((a: string, b: string) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
  };

  const availablePlans = phoneData ? parseAvailablePlans(phoneData.available_plans) : [];
  const bundle = selectedBundle ? bundles[selectedBundle] : null;

  const payLaterBreakdown = phoneData ? calculatePayLaterTotal(
    phoneData.monthly_price || 0,
    phoneData.boost_protect || 0,
    selectedPlan,
    taxRate
  ) : { total: 0, deviceOnly: 0, boostProtect: 0, planPrice: 0, tax: 0 };

  const dueToday = phoneData ? calculatePayLaterDueToday(
    phoneData.monthly_price || 0,
    phoneData.srp || 0,
    bundle?.price || 0,
    taxRate
  ) : { total: 0, deviceFinancePrice: 0, setupCharge: 0, deviceTax: 0, bundlePrice: 0, bundleTax: 0 };

  if (loading) {
    return <div className="text-center p-4">Loading phone details...</div>;
  }

  if (error || !phoneData) {
    return <div className="text-center p-4 text-red-500">{error || 'No phone data available'}</div>;
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {/* Plan Selection */}
        <div className="col-span-2">
          <label className="text-xs text-[#ff6900] mb-1 block font-medium">Plan:</label>
          <select 
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="w-full p-1.5 text-xs rounded border text-[#ff6900]"
          >
            {availablePlans.map(plan => (
              <option key={plan} value={plan}>{plan} Plan</option>
            ))}
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

        {/* Monthly Payment */}
        <div className="col-span-2 bg-gradient-to-r from-[#ff6900] to-yellow-400 p-2 rounded-lg">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-white flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Monthly Payment
            </span>
            <span className="text-xs font-bold text-white">
              ${payLaterBreakdown.total.toFixed(2)}/mo
            </span>
          </div>
          <div className="bg-white p-1.5 rounded-lg space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-600">Device:</span>
              <span className="font-medium">${payLaterBreakdown.deviceOnly.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-600">Boost Protect:</span>
              <span className="font-medium">${payLaterBreakdown.boostProtect.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium">${payLaterBreakdown.planPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">${payLaterBreakdown.tax.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Due Today */}
        <div className="col-span-2 bg-gradient-to-r from-yellow-400 to-[#ff6900] p-2 rounded-lg">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-white flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Due Today
            </span>
            <span className="text-xs font-bold text-white">
              ${dueToday.total.toFixed(2)}
            </span>
          </div>
          <div className="bg-white p-1.5 rounded-lg space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-600">Device Payment:</span>
              <span className="font-medium">${dueToday.deviceFinancePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-600">Setup:</span>
              <span className="font-medium">${dueToday.setupCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-600">Device Tax:</span>
              <span className="font-medium">${dueToday.deviceTax.toFixed(2)}</span>
            </div>
            {bundle && (
              <>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-600">Bundle:</span>
                  <span className="font-medium">${dueToday.bundlePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-600">Bundle Tax:</span>
                  <span className="font-medium">${dueToday.bundleTax.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayLaterBundle;