import React from 'react';
import { bundles } from '../utils/pricing';

interface BundleSelectorProps {
  selectedBundle: string | null;
  onBundleSelect: (bundleId: string | null) => void;
}

const BundleSelector: React.FC<BundleSelectorProps> = ({ selectedBundle, onBundleSelect }) => {
  return (
    <div className="mb-3 bg-white p-3 rounded-lg shadow-md">
      <label className="text-[#ff6900] text-sm mb-1 block font-medium">Select Accessory Bundle:</label>
      <select 
        value={selectedBundle || ''}
        onChange={(e) => onBundleSelect(e.target.value || null)}
        className="w-full p-2 rounded border border-gray-200 text-[#ff6900] focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent"
      >
        <option value="">No Bundle</option>
        {Object.entries(bundles).map(([key, bundle]) => (
          <option key={key} value={key}>
            {bundle.name} (${bundle.price.toFixed(2)})
          </option>
        ))}
      </select>
    </div>
  );
};

export default BundleSelector;