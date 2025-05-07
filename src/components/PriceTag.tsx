import React from 'react';
import { Tag, Clock } from 'lucide-react';

interface PriceTagProps {
  portPrice: number;
  monthlyPrice: number;
}

const PriceTag: React.FC<PriceTagProps> = ({ portPrice, monthlyPrice }) => {
  // Handle edge cases where prices might be undefined, null, or NaN
  const validPortPrice = typeof portPrice === 'number' && !isNaN(portPrice) ? portPrice : 0;
  const validMonthlyPrice = typeof monthlyPrice === 'number' && !isNaN(monthlyPrice) ? monthlyPrice : 0;
  
  const price = Math.min(
    validPortPrice === 0 ? Infinity : validPortPrice,
    validMonthlyPrice === 0 ? Infinity : validMonthlyPrice
  );
  
  const isFree = price === 0 || price === Infinity;

  return (
    <div className="flex flex-col gap-1">
      {isFree ? (
        <div className="bg-green-500 text-white px-4 py-2 rounded-full inline-block transform transition-all duration-300 hover:scale-105 shadow-md">
          <p className="font-bold flex items-center justify-center text-sm gap-1">
            FREE
            <span className="animate-pulse">🔥</span>
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-yellow-400 to-[#ff6900] text-white px-4 py-2 rounded-full inline-block transform transition-all duration-300 hover:scale-105 shadow-md">
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <p className="font-bold text-sm">
              ${validMonthlyPrice.toFixed(2)}/mo
            </p>
          </div>
        </div>
      )}
      {validPortPrice > 0 && validMonthlyPrice > 0 && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>or ${validPortPrice.toFixed(2)} today</span>
        </div>
      )}
    </div>
  );
};

export default PriceTag;