import React from 'react';
import { stateTaxRates } from '../data/taxRates';

interface StateSelectorProps {
  selectedState: string;
  onStateSelect: (state: string) => void;
}

const StateSelector: React.FC<StateSelectorProps> = ({ selectedState, onStateSelect }) => {
  return (
    <div className="mb-3 bg-white p-3 rounded-lg shadow-md">
      <label className="text-[#ff6900] text-sm mb-1 block font-medium">Select State:</label>
      <select 
        value={selectedState}
        onChange={(e) => onStateSelect(e.target.value)}
        className="w-full p-2 rounded border border-gray-200 text-[#ff6900] focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent"
      >
        {Object.keys(stateTaxRates).map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StateSelector;