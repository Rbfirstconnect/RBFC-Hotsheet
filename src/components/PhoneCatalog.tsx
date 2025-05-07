import React, { useState, useMemo, useEffect } from 'react';
import { stateTaxRates } from '../data/taxRates';
import PhoneCard from './PhoneCard';
import PhoneDetailsModal from './PhoneDetailsModal';
import StateSelector from './StateSelector';
import { Check, Filter, Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface PhoneCatalogProps {
  searchQuery: string;
}

const BRANDS = ['Apple', 'Samsung', 'Motorola', 'Celero', 'Summit', 'TCL', 'Others'];
const STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB'];

const PhoneCatalog: React.FC<PhoneCatalogProps> = ({ searchQuery }) => {
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [selectedState, setSelectedState] = useState('NY');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [phones, setPhones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [expandedFilterSections, setExpandedFilterSections] = useState({
    brands: true,
    storage: true
  });

  useEffect(() => {
    fetchPhones();
  }, []);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const fetchPhones = async () => {
    try {
      const { data, error } = await supabase
        .from('phone_details')
        .select('*');

      if (error) throw error;

      const transformedPhones = data.map(phone => ({
        id: phone.id,
        name: phone.name,
        brand: phone.brand,
        color: phone.color,
        storage: phone.storage,
        screenSize: phone.screen_size,
        srp: phone.srp,
        imageUrl: phone.image_url,
        payNow: {
          port: {
            price: phone.port_in_price || 0,
            plans: Array.isArray(phone.available_plans) 
              ? phone.available_plans
                  .filter(p => p.type === 'port_in')
                  .map(p => `$${p.price}`) 
              : []
          },
          nonPort: {
            price: phone.non_port_price || 0
          },
          upgrade: phone.upgrade_price || 0
        },
        payLater: {
          monthlyPrice: phone.monthly_price || 0,
          boostProtect: phone.boost_protect || 0,
          plans: Array.isArray(phone.available_plans)
            ? phone.available_plans
                .filter(p => p.type === 'pay_later')
                .reduce((acc, p) => ({
                  ...acc,
                  [`$${p.price}`]: { total: p.price }
                }), {})
            : {}
        },
        promotion: phone.promotion_type ? {
          type: phone.promotion_type,
          text: phone.promotion_text,
          validFrom: phone.promotion_valid_from,
          validTo: phone.promotion_valid_to
        } : undefined,
        specifications: phone.specifications || {}
      }));

      setPhones(transformedPhones);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching phones:', err);
      setError('Failed to load phones. Please try again later.');
      setIsLoading(false);
    }
  };

  const filteredPhones = useMemo(() => {
    let filtered = phones;
    
    if (localSearchQuery) {
      const query = localSearchQuery.toLowerCase();
      filtered = filtered.filter(phone => 
        phone.name.toLowerCase().includes(query) || 
        phone.brand.toLowerCase().includes(query)
      );
    }
    
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(phone => selectedBrands.includes(phone.brand));
    }

    if (selectedStorage.length > 0) {
      filtered = filtered.filter(phone => selectedStorage.includes(phone.storage));
    }
    
    return filtered;
  }, [localSearchQuery, selectedBrands, selectedStorage, phones]);

  // Group phones by brand
  const groupedPhones = useMemo(() => {
    const groups = filteredPhones.reduce((acc, phone) => {
      const brand = phone.brand;
      if (!acc[brand]) {
        acc[brand] = [];
      }
      acc[brand].push(phone);
      return acc;
    }, {});

    // Sort brands alphabetically
    return Object.keys(groups)
      .sort()
      .reduce((acc, brand) => {
        acc[brand] = groups[brand];
        return acc;
      }, {});
  }, [filteredPhones]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleStorageToggle = (storage: string) => {
    setSelectedStorage(prev =>
      prev.includes(storage)
        ? prev.filter(s => s !== storage)
        : [...prev, storage]
    );
  };

  const handlePhoneClick = (phone) => {
    setSelectedPhone(phone);
    setShowDetails(true);
  };

  const handleCloseModal = () => {
    setShowDetails(false);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedStorage([]);
    setLocalSearchQuery('');
  };

  const toggleFilterSection = (section) => {
    setExpandedFilterSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = selectedBrands.length > 0 || selectedStorage.length > 0 || localSearchQuery;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#ff6900] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 border-opacity-30 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 p-6 rounded-xl text-center shadow-md border border-red-200"
      >
        <div className="text-red-500 mx-auto w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-red-100">
          <X className="w-6 h-6" />
        </div>
        <p className="text-red-700 font-medium mb-3">{error}</p>
        <motion.button 
          onClick={fetchPhones}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-2 px-4 py-2 bg-gradient-to-r from-[#ff6900] to-[#ff8b3d] text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden backdrop-blur-sm"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white h-full w-full max-w-xs p-5 ml-auto rounded-l-2xl shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="space-y-6">
                {/* Mobile Search */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Search
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={localSearchQuery}
                      onChange={(e) => setLocalSearchQuery(e.target.value)}
                      placeholder="Search phones..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6900] focus:border-[#ff6900] transition-all duration-200 bg-gray-50 placeholder-gray-400"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    {localSearchQuery && (
                      <button 
                        onClick={() => setLocalSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Mobile Brand Filters */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <button 
                    onClick={() => toggleFilterSection('brands')}
                    className="flex justify-between items-center w-full font-medium text-sm mb-2"
                  >
                    <span>Brands</span>
                    <motion.div
                      animate={{ rotate: expandedFilterSections.brands ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedFilterSections.brands && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {BRANDS.map(brand => (
                          <label key={brand} className="flex items-center py-1">
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => handleBrandToggle(brand)}
                                className="peer sr-only"
                              />
                              <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-[#ff6900] peer-checked:border-[#ff6900] transition-colors"></div>
                              {selectedBrands.includes(brand) && (
                                <Check className="absolute text-white w-3 h-3 left-1 top-1" />
                              )}
                            </div>
                            <span className="ml-3 text-sm">{brand}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Storage Filters */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <button 
                    onClick={() => toggleFilterSection('storage')}
                    className="flex justify-between items-center w-full font-medium text-sm mb-2"
                  >
                    <span>Storage</span>
                    <motion.div
                      animate={{ rotate: expandedFilterSections.storage ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedFilterSections.storage && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {STORAGE_OPTIONS.map(storage => (
                          <label key={storage} className="flex items-center py-1">
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedStorage.includes(storage)}
                                onChange={() => handleStorageToggle(storage)}
                                className="peer sr-only"
                              />
                              <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-[#ff6900] peer-checked:border-[#ff6900] transition-colors"></div>
                              {selectedStorage.includes(storage) && (
                                <Check className="absolute text-white w-3 h-3 left-1 top-1" />
                              )}
                            </div>
                            <span className="ml-3 text-sm">{storage}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Apply Filters Button */}
                <div className="pt-4 border-t">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full bg-gradient-to-r from-[#ff6900] to-[#ff8b3d] text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Apply Filters
                  </motion.button>
                  {hasActiveFilters && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={clearFilters}
                      className="w-full mt-3 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Clear All Filters
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Layout */}
      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden md:block w-72 flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-5 sticky top-24 border border-gray-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold flex items-center gap-2 text-gray-800">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </h3>
              {hasActiveFilters && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="text-xs text-[#ff6900] hover:text-[#ff8b3d] font-medium hover:underline transition-colors"
                >
                  Clear All
                </motion.button>
              )}
            </div>

            {/* Desktop Search Input */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder="Search phones..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6900] focus:border-[#ff6900] transition-all duration-200 bg-gray-50 placeholder-gray-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                {localSearchQuery && (
                  <button 
                    onClick={() => setLocalSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Brand Filters */}
            <div className="mb-6 bg-gray-50 p-4 rounded-xl">
              <button 
                onClick={() => toggleFilterSection('brands')}
                className="flex justify-between items-center w-full font-medium text-sm mb-3"
              >
                <span>Brands</span>
                <motion.div
                  animate={{ rotate: expandedFilterSections.brands ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {expandedFilterSections.brands && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 overflow-hidden"
                  >
                    {BRANDS.map(brand => (
                      <label key={brand} className="flex items-center py-1 hover:bg-gray-100 px-2 rounded-lg transition-colors cursor-pointer">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-[#ff6900] peer-checked:border-[#ff6900] transition-colors"></div>
                          {selectedBrands.includes(brand) && (
                            <Check className="absolute text-white w-3 h-3 left-1 top-1" />
                          )}
                        </div>
                        <span className="ml-3 text-sm">{brand}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Storage Filters */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <button 
                onClick={() => toggleFilterSection('storage')}
                className="flex justify-between items-center w-full font-medium text-sm mb-3"
              >
                <span>Storage</span>
                <motion.div
                  animate={{ rotate: expandedFilterSections.storage ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {expandedFilterSections.storage && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 overflow-hidden"
                  >
                    {STORAGE_OPTIONS.map(storage => (
                      <label key={storage} className="flex items-center py-1 hover:bg-gray-100 px-2 rounded-lg transition-colors cursor-pointer">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedStorage.includes(storage)}
                            onChange={() => handleStorageToggle(storage)}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-[#ff6900] peer-checked:border-[#ff6900] transition-colors"></div>
                          {selectedStorage.includes(storage) && (
                            <Check className="absolute text-white w-3 h-3 left-1 top-1" />
                          )}
                        </div>
                        <span className="ml-3 text-sm">{storage}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Header */}
          <div className="md:hidden mb-6">
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-2.5 border rounded-xl text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
                {hasActiveFilters && (
                  <span className="bg-[#ff6900] text-white text-xs px-2 py-0.5 rounded-full">
                    {(selectedBrands.length + selectedStorage.length) + (localSearchQuery ? 1 : 0)}
                  </span>
                )}
              </motion.button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder="Search phones..."
                  className="w-full pl-10 pr-4 py-2.5 border rounded-xl shadow-sm focus:ring-2 focus:ring-[#ff6900] focus:border-[#ff6900] transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                {localSearchQuery && (
                  <button 
                    onClick={() => setLocalSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-between items-center mb-6"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff6900] to-[#ff8b3d] bg-clip-text text-transparent">
              Devices
            </h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
              {filteredPhones.length} {filteredPhones.length === 1 ? 'device' : 'devices'} found
            </span>
          </motion.div>
          
          {/* Active Filters */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 flex flex-wrap gap-2"
              >
                {localSearchQuery && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-1 bg-gradient-to-r from-[#ff6900] to-[#ff8b3d] text-white px-3 py-1.5 rounded-full text-sm shadow-sm"
                  >
                    Search: {localSearchQuery}
                    <button
                      onClick={() => setLocalSearchQuery('')}
                      className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                )}
                {selectedBrands.map(brand => (
                  <motion.span
                    key={brand}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-1 bg-[#ff6900] bg-opacity-10 text-[#ff6900] px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                  >
                    {brand}
                    <button
                      onClick={() => handleBrandToggle(brand)}
                      className="hover:bg-[#ff6900] hover:bg-opacity-20 rounded-full p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
                {selectedStorage.map(storage => (
                  <motion.span
                    key={storage}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-1 bg-[#ff6900] bg-opacity-10 text-[#ff6900] px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                  >
                    {storage}
                    <button
                      onClick={() => handleStorageToggle(storage)}
                      className="hover:bg-[#ff6900] hover:bg-opacity-20 rounded-full p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
                {hasActiveFilters && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700 text-sm border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Clear all
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phone Grid */}
          {filteredPhones.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-xl shadow-md text-center border border-gray-200"
            >
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3 
                }}
                className="text-gray-400 mb-6 bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto"
              >
                <Search className="w-12 h-12" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No devices found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters for more results</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="text-white bg-gradient-to-r from-[#ff6900] to-[#ff8b3d] hover:from-[#ff8b3d] hover:to-[#ff6900] px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                Clear Filters
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedPhones).map(([brand, phones]) => (
                <motion.div
                  key={brand}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    {brand}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(phones as any[]).map((phone, index) => (
                      <motion.div
                        key={phone.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <PhoneCard 
                          phone={phone}
                          onClick={() => handlePhoneClick(phone)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {showDetails && selectedPhone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-auto"
            >
              <PhoneDetailsModal 
                phone={selectedPhone}
                taxRate={stateTaxRates[selectedState]}
                onClose={handleCloseModal}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhoneCatalog;

