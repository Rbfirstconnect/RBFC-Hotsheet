import React from 'react';

const Watermark: React.FC = () => {
  return (
    <div className="fixed bottom-2 right-2 text-xs text-white opacity-50 pointer-events-none">
      Boost Mobile Shop Demo
    </div>
  );
};

export default Watermark;