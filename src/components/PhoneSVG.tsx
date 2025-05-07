import React from 'react';

interface PhoneSVGProps {
  model: string;
  className?: string;
}

const PhoneSVG: React.FC<PhoneSVGProps> = ({ model, className }) => {
  const getPromotionalBanner = (modelId: string) => {
    if (!modelId) return null;

    // BOGO offer for Moto Edge 2023
    if (modelId.toLowerCase().includes('moto-edge-2023')) {
      return (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl">
          BOGO
        </div>
      );
    }
    return null;
  };

  const svgs = {
    'iphone': (
      <svg viewBox="0 0 200 400" className={className}>
        <rect x="10" y="10" width="180" height="380" rx="30" fill="#f1f1f1" stroke="#333" strokeWidth="2"/>
        <rect x="85" y="20" width="30" height="15" rx="5" fill="#333"/>
        <circle cx="100" cy="350" r="15" stroke="#333" strokeWidth="2" fill="none"/>
        <rect x="20" y="45" width="160" height="290" rx="5" fill="#fff" stroke="#ddd"/>
      </svg>
    ),
    'samsung': (
      <svg viewBox="0 0 200 400" className={className}>
        <rect x="10" y="10" width="180" height="380" rx="20" fill="#f5f5f5" stroke="#333" strokeWidth="2"/>
        <circle cx="100" cy="25" r="5" fill="#333"/>
        <rect x="20" y="45" width="160" height="290" rx="5" fill="#fff" stroke="#ddd"/>
      </svg>
    ),
    'motorola': (
      <svg viewBox="0 0 200 400" className={className}>
        <rect x="10" y="10" width="180" height="380" rx="25" fill="#e0e0e0" stroke="#333" strokeWidth="2"/>
        <circle cx="100" cy="25" r="5" fill="#333"/>
        <rect x="20" y="45" width="160" height="290" rx="5" fill="#fff" stroke="#ddd"/>
        <path d="M 170 80 C 180 100, 180 120, 170 140" stroke="#444" fill="none" strokeWidth="3"/>
      </svg>
    ),
    'other': (
      <svg viewBox="0 0 200 400" className={className}>
        <rect x="10" y="10" width="180" height="380" rx="15" fill="#f8f8f8" stroke="#333" strokeWidth="2"/>
        <rect x="20" y="45" width="160" height="290" rx="5" fill="#fff" stroke="#ddd"/>
      </svg>
    )
  };

  const getDeviceSVG = (model: string) => {
    const modelLower = model.toLowerCase();
    if (modelLower.includes('iphone')) return svgs['iphone'];
    if (modelLower.includes('samsung')) return svgs['samsung'];
    if (modelLower.includes('moto')) return svgs['motorola'];
    return svgs['other'];
  };

  return (
    <div className="relative">
      {getDeviceSVG(model)}
      {getPromotionalBanner(model)}
    </div>
  );
};

export default PhoneSVG;