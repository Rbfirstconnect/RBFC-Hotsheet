import React from 'react';
import { Info, Smartphone, Tag, Clock } from 'lucide-react';
import PriceTag from './PriceTag';

interface PhoneCardProps {
  phone: any;
  onClick: () => void;
}

const PhoneCard: React.FC<PhoneCardProps> = ({ phone, onClick }) => {
  const isOnSale = phone.payNow?.port?.price === 0 || (phone.promotion?.type === 'SALE');
  const isBogo = phone.promotion?.type === 'BOGO';
  const isDeal = phone.promotion?.type === 'DEAL';

  const getPromotionColor = () => {
    if (isOnSale) return 'bg-red-500';
    if (isBogo) return 'bg-purple-500';
    if (isDeal) return 'bg-green-500';
    return 'bg-[#ff6900]';
  };

  const daysUntilEnd = phone.promotion
    ? Math.ceil((new Date(phone.promotion.validTo).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div 
      className="group bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 w-full h-[480px] flex flex-col"
      onClick={onClick}
    >
      {/* Image Container with fixed dimensions */}
      <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 h-[280px] flex justify-center items-center flex-shrink-0">
        {phone.promotion && (
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10">
            <div className={`${getPromotionColor()} text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1`}>
              <Tag className="w-3 h-3" />
              {phone.promotion.type}
            </div>
            {daysUntilEnd > 0 && daysUntilEnd <= 7 && (
              <div className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {daysUntilEnd} days left
              </div>
            )}
          </div>
        )}
        
        {/* Image wrapper with fixed dimensions and proper scaling */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <img 
            src={phone.imageUrl} 
            alt={phone.name}
            className="max-w-full max-h-full w-auto h-auto object-contain transform group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </div>
      
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg text-[#ff6900] truncate">{phone.name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-700">{phone.brand}</p>
              <span className="text-xs text-gray-500">•</span>
              <p className="text-sm text-gray-600">SRP: ${phone.srp?.toFixed(2)}</p>
            </div>
          </div>
          <span className="bg-gray-100 text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-2 text-gray-700">
            {phone.storage}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-4 h-4 text-[#ff6900] flex-shrink-0" />
          <span className="text-sm text-gray-700 truncate">
            {phone.color} • {phone.screenSize}"
          </span>
        </div>

        {phone.promotion && (
          <div className="mb-4 p-2 bg-[#ff6900] bg-opacity-5 rounded-lg">
            <p className="text-xs text-[#ff6900] line-clamp-2">{phone.promotion.text}</p>
          </div>
        )}
        
        <div className="mt-auto flex justify-between items-center">
          <PriceTag 
            portPrice={phone.payNow?.port?.price || 0} 
            monthlyPrice={phone.payLater?.monthlyPrice || 0} 
          />
          
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group-hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Info className="w-5 h-5 text-[#ff6900]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneCard;