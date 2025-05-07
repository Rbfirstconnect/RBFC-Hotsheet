import React, { useState } from 'react';
import { X, Gift, Info, Tag, Clock, ChevronRight } from 'lucide-react';
import StandardPricing from './pricing/StandardPricing';
import PayNowBundle from './pricing/PayNowBundle';
import PayLaterBundle from './pricing/PayLaterBundle';
import SpecificationsModal from './SpecificationsModal';
import Watermark from './Watermark';

interface PhoneDetailsModalProps {
  phone: any;
  taxRate: number;
  onClose: () => void;
}

const PhoneDetailsModal: React.FC<PhoneDetailsModalProps> = ({ 
  phone, 
  taxRate, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('standard');
  const [showSpecs, setShowSpecs] = useState(false);
  const isOnSale = phone.payNow?.port?.price === 0 || (phone.promotion?.type === 'SALE');
  
  const lowestPrice = Math.min(
    phone.payNow?.port?.price || Infinity,
    phone.payLater?.monthlyPrice || Infinity
  ).toFixed(2);

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full sm:max-w-md sm:rounded-t-2xl rounded-b-none sm:rounded-b-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{maxHeight: '95vh', overflowY: 'auto'}}
      >
        {/* Drag indicator for mobile */}
        <div className="flex justify-center pt-2 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Close button - floating */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 p-1 sm:hidden"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        
        {/* Header with image */}
        <div className="relative pb-4">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#ff6900]/10 to-white"></div>
          
          {/* Content */}
          <div className="relative px-4 pt-4 sm:pt-6">
            <div className="flex items-center gap-4">
              {/* Image */}
              <div className="relative w-20 h-20 bg-white/80 rounded-xl p-2 shadow-md">
                <img 
                  src={phone.imageUrl} 
                  alt={phone.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
                {isOnSale && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium animate-pulse">
                    SALE
                  </span>
                )}
              </div>
              
              {/* Phone info */}
              <div className="flex-1">
                <div className="flex justify-between">
                  <h2 className="text-lg font-bold text-gray-800 line-clamp-1">{phone.name}</h2>
                  <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 hidden sm:block"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-sm text-gray-500">{phone.brand} • {phone.storage}</p>
                
                <div className="mt-1 flex items-center">
                  {lowestPrice === '0.00' ? (
                    <span className="text-lg font-bold text-green-600">FREE</span>
                  ) : (
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold text-[#ff6900]">${lowestPrice}</span>
                      <span className="text-xs text-gray-500 ml-1">/mo</span>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => setShowSpecs(true)}
                    className="ml-auto text-xs text-[#ff6900] font-medium flex items-center gap-1 border border-[#ff6900]/30 px-2 py-0.5 rounded-full"
                  >
                    <Info className="w-3 h-3" />
                    Specs
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Promotion banner */}
        {phone.promotion && (
          <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border-y border-orange-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#ff6900]" />
                <span className="font-medium text-sm text-[#ff6900] line-clamp-1">
                  {phone.promotion.text}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs whitespace-nowrap">
                <Clock className="w-3 h-3" />
                <span>Ends {new Date(phone.promotion.validTo).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs - pill style */}
        <div className="px-4 pt-4 pb-1">
          <div className="flex p-1 bg-gray-100 rounded-full">
            {[
              { id: 'standard', label: 'Standard' },
              { id: 'paynow', label: 'Pay Now' },
              { id: 'paylater', label: 'Pay Later' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-[#ff6900] shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Content area */}
        <div className="p-4">
          {activeTab === 'standard' && <StandardPricing phone={phone} taxRate={taxRate} />}
          {activeTab === 'paynow' && <PayNowBundle phone={phone} taxRate={taxRate} />}
          {activeTab === 'paylater' && <PayLaterBundle phoneId={phone.id} taxRate={taxRate} />}
        </div>
        
        {/* Bottom padding for mobile */}
        <div className="h-6 sm:hidden"></div>
      </div>
      
      {showSpecs && (
        <SpecificationsModal 
          phone={phone} 
          onClose={() => setShowSpecs(false)} 
        />
      )}
      
      <Watermark />
    </div>
  );
};

export default PhoneDetailsModal;