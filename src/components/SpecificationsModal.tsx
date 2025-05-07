import React, { useState } from 'react';
import { X, Monitor, Camera, Battery } from 'lucide-react';

interface SpecificationsModalProps {
  phone: any;
  onClose: () => void;
}

const SpecificationsModal: React.FC<SpecificationsModalProps> = ({ phone, onClose }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const specs = phone?.specifications || {};

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const formatSpecValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') {
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    }
    return String(value);
  };

  const renderSpecifications = (specs: any) => {
    if (!specs || typeof specs !== 'object') return null;

    return Object.entries(specs).map(([category, details]) => {
      if (!details || typeof details !== 'object') return null;

      return (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold text-[#ff6900] mb-3 flex items-center gap-2">
            {category === 'display' && <Monitor className="w-5 h-5" />}
            {category === 'camera' && <Camera className="w-5 h-5" />}
            {category === 'battery' && <Battery className="w-5 h-5" />}
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h3>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{key}</span>
                <span className="text-sm font-medium">{formatSpecValue(value)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[60] backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden"
        onClick={handleModalClick}
      >
        <div className="p-6 border-b relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff6900] to-yellow-500 opacity-5"></div>
          <div className="flex justify-between items-center relative">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-50 rounded-xl p-2 shadow-sm">
                <img 
                  src={phone.imageUrl} 
                  alt={phone.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#ff6900]">{phone.name}</h2>
                <p className="text-sm text-gray-500">{phone.brand}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors relative z-10"
              aria-label="Close specifications"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {Object.keys(specs).length > 0 ? (
            <div className="space-y-6">
              {renderSpecifications(specs)}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Specifications not available for this device.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecificationsModal;