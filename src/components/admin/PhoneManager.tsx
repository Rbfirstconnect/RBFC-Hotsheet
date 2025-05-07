import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, Smartphone, Shield, Cpu, Camera, Battery, Monitor, Tag, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

interface PhoneFormData {
  id: string;
  name: string;
  brand: string;
  color: string;
  storage: string;
  screenSize: number;
  srp: number;
  imageUrl: string;
  payNow: {
    port: {
      price: number;
      plans: string[];
    };
    nonPort: {
      price: number;
    };
    upgrade: number;
  };
  payLater: {
    monthlyPrice: number;
    boostProtect: number;
    plans: {
      [key: string]: {
        total: number;
      };
    };
  };
  promotion?: {
    type: string;
    text: string;
    validFrom: string;
    validTo: string;
  };
}

const defaultPhone: PhoneFormData = {
  id: '',
  name: '',
  brand: '',
  color: '',
  storage: '',
  screenSize: 0,
  srp: 0,
  imageUrl: '',
  payNow: {
    port: {
      price: 0,
      plans: ['$50', '$60']
    },
    nonPort: {
      price: 0
    },
    upgrade: 0
  },
  payLater: {
    monthlyPrice: 0,
    boostProtect: 0,
    plans: {
      '$50': { total: 50 },
      '$60': { total: 60 }
    }
  }
};

const PhoneManager: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPhone, setEditingPhone] = useState<PhoneFormData | null>(null);
  const [phonesList, setPhonesList] = useState<PhoneFormData[]>([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [specifications, setSpecifications] = useState({
    display: {
      type: '',
      size: '',
      resolution: '',
      protection: '',
      features: ''
    },
    camera: {
      main: '',
      features: '',
      video: '',
      selfie: ''
    },
    battery: {
      type: '',
      charging: '',
      standby: '',
      talkTime: ''
    }
  });

  useEffect(() => {
    fetchPhones();
  }, []);

  const fetchPhones = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const { data, error } = await supabase
        .from('phone_details')
        .select('*');

      if (error) throw error;

      const transformedPhones = data.map(phone => {
        let availablePlans = [];
        try {
          if (typeof phone.available_plans === 'string') {
            availablePlans = JSON.parse(phone.available_plans);
          } else if (Array.isArray(phone.available_plans)) {
            availablePlans = phone.available_plans;
          }
        } catch (e) {
          console.error('Error parsing available_plans:', e);
        }
        
        return {
          id: phone.id,
          name: phone.name,
          brand: phone.brand,
          color: phone.color,
          storage: phone.storage,
          screenSize: phone.screen_size || 0,
          srp: phone.srp || 0,
          imageUrl: phone.image_url || '',
          payNow: {
            port: {
              price: phone.port_in_price || 0,
              plans: Array.isArray(availablePlans) 
                ? availablePlans
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
            plans: Array.isArray(availablePlans)
              ? availablePlans
                  .filter(p => p.type === 'pay_later')
                  .reduce((acc, p) => ({
                    ...acc,
                    [`$${p.price}`]: { total: p.price }
                  }), {})
              : {}
          },
          promotion: phone.promotion_type ? {
            type: phone.promotion_type,
            text: phone.promotion_text || '',
            validFrom: phone.promotion_valid_from || '',
            validTo: phone.promotion_valid_to || ''
          } : undefined
        };
      });

      setPhonesList(transformedPhones);
    } catch (err) {
      console.error('Error fetching phones:', err);
      setErrorMessage(`Error fetching phones: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (phone: PhoneFormData) => {
    setEditingPhone({...phone});
    setIsEditing(true);
  };

  const handleDelete = async (phoneId: string) => {
    if (confirm('Are you sure you want to delete this phone?')) {
      try {
        setErrorMessage(null);
        const { error } = await supabase
          .from('phone_details')
          .delete()
          .eq('id', phoneId);

        if (error) throw error;

        setPhonesList(phones => phones.filter(p => p.id !== phoneId));
      } catch (err) {
        console.error('Error deleting phone:', err);
        setErrorMessage(`Error deleting phone: ${err.message}`);
      }
    }
  };

  const handleAdd = () => {
    setEditingPhone({ ...defaultPhone, id: uuidv4() });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhone) return;

    try {
      setErrorMessage(null);
      
      const phoneData = {
        id: editingPhone.id,
        name: editingPhone.name,
        brand: editingPhone.brand,
        color: editingPhone.color,
        storage: editingPhone.storage,
        screen_size: editingPhone.screenSize,
        srp: editingPhone.srp,
        image_url: editingPhone.imageUrl,
        port_in_price: editingPhone.payNow.port.price,
        non_port_price: editingPhone.payNow.nonPort.price,
        upgrade_price: editingPhone.payNow.upgrade,
        monthly_price: editingPhone.payLater.monthlyPrice,
        boost_protect: editingPhone.payLater.boostProtect,
        available_plans: JSON.stringify([
          ...editingPhone.payNow.port.plans.map(plan => ({
            price: parseInt(plan.replace('$', '')),
            type: 'port_in'
          })),
          ...Object.keys(editingPhone.payLater.plans).map(plan => ({
            price: parseInt(plan.replace('$', '')),
            type: 'pay_later'
          }))
        ]),
        promotion_type: editingPhone.promotion?.type || null,
        promotion_text: editingPhone.promotion?.text || null,
        promotion_valid_from: editingPhone.promotion?.validFrom || null,
        promotion_valid_to: editingPhone.promotion?.validTo || null,
        specifications: JSON.stringify(specifications)
      };

      if (!phoneData.id) {
        phoneData.id = uuidv4();
      }

      const { data, error } = await supabase
        .from('phone_details')
        .upsert(phoneData)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Failed to save phone');

      await fetchPhones();
      setIsEditing(false);
      setEditingPhone(null);
    } catch (err) {
      console.error('Error saving phone:', err);
      setErrorMessage(`Error saving phone: ${err.message}`);
    }
  };

  const updatePayNowPlans = (plan: string, checked: boolean) => {
    if (!editingPhone) return;
    
    const currentPlans = editingPhone.payNow.port.plans;
    const newPlans = checked 
      ? [...currentPlans, plan].sort()
      : currentPlans.filter(p => p !== plan);

    setEditingPhone({
      ...editingPhone,
      payNow: {
        ...editingPhone.payNow,
        port: {
          ...editingPhone.payNow.port,
          plans: newPlans
        }
      }
    });
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Smartphone },
    { id: 'payNow', label: 'Pay Now Options', icon: Shield },
    { id: 'payLater', label: 'Pay Later Options', icon: Cpu },
    { id: 'promotion', label: 'Promotion', icon: Tag },
    { id: 'specifications', label: 'Specifications', icon: Settings }
  ];

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6900] mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading phones...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#ff6900]">Phone Management</h2>
        <button
          onClick={handleAdd}
          className="bg-[#ff6900] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#e05e00] transition-colors"
        >
          <Plus size={20} />
          Add Phone
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span>{errorMessage}</span>
          <button 
            className="float-right"
            onClick={() => setErrorMessage(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {isEditing && editingPhone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#ff6900]">
                {editingPhone.id ? 'Edit Phone' : 'Add New Phone'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex gap-2 border-b">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 flex items-center gap-2 ${
                      activeTab === tab.id 
                        ? 'text-[#ff6900] border-b-2 border-[#ff6900]' 
                        : 'text-gray-500'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'basic' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingPhone.name}
                      onChange={e => setEditingPhone({
                        ...editingPhone,
                        name: e.target.value
                      })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={editingPhone.brand}
                      onChange={e => setEditingPhone({
                        ...editingPhone,
                        brand: e.target.value
                      })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      value={editingPhone.color}
                      onChange={e => setEditingPhone({
                        ...editingPhone,
                        color: e.target.value
                      })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Storage
                    </label>
                    <input
                      type="text"
                      value={editingPhone.storage}
                      onChange={e => setEditingPhone({
                        ...editingPhone,
                        storage: e.target.value
                      })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Screen Size
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingPhone.screenSize}
                      onChange={e => setEditingPhone({
                        ...editingPhone,
                        screenSize: parseFloat(e.target.value)
                      })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SRP
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingPhone.srp}
                      onChange={e => setEditingPhone({
                        ...editingPhone,
                        srp: parseFloat(e.target.value)
                      })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={editingPhone.imageUrl}
                      onChange={e => setEditingPhone({
                        ...editingPhone,
                        imageUrl: e.target.value
                      })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
              )}

              {activeTab === 'payNow' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-4">Port-In Options</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Port-In Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingPhone.payNow.port.price}
                          onChange={e => setEditingPhone({
                            ...editingPhone,
                            payNow: {
                              ...editingPhone.payNow,
                              port: {
                                ...editingPhone.payNow.port,
                                price: parseFloat(e.target.value)
                              }
                            }
                          })}
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Available Plans
                        </label>
                        <div className="space-y-2">
                          {['$25', '$50', '$60'].map(plan => (
                            <label key={plan} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingPhone.payNow.port.plans.includes(plan)}
                                onChange={e => updatePayNowPlans(plan, e.target.checked)}
                                className="rounded text-[#ff6900]"
                              />
                              <span className="text-sm">{plan} Plan</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-4">Non-Port Options</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Non-Port Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingPhone.payNow.nonPort.price}
                        onChange={e => setEditingPhone({
                          ...editingPhone,
                          payNow: {
                            ...editingPhone.payNow,
                            nonPort: {
                              price: parseFloat(e.target.value)
                            }
                          }
                        })}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-4">Upgrade Price</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upgrade Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingPhone.payNow.upgrade}
                        onChange={e => setEditingPhone({
                          ...editingPhone,
                          payNow: {
                            ...editingPhone.payNow,
                            upgrade: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payLater' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-4">Monthly Payments</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Monthly Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingPhone.payLater.monthlyPrice}
                          onChange={e => setEditingPhone({
                            ...editingPhone,
                            payLater: {
                              ...editingPhone.payLater,
                              monthlyPrice: parseFloat(e.target.value)
                            }
                          })}
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Boost Protect
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingPhone.payLater.boostProtect}
                          onChange={e => setEditingPhone({
                            ...editingPhone,
                            payLater: {
                              ...editingPhone.payLater,
                              boostProtect: parseFloat(e.target.value)
                            }
                          })}
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-4">Plan Totals</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(editingPhone.payLater.plans).map(([plan, details]) => (
                        <div key={plan}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {plan} Plan Total
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={details.total}
                            onChange={e => setEditingPhone({
                              ...editingPhone,
                              payLater: {
                                ...editingPhone.payLater,
                                plans: {
                                  ...editingPhone.payLater.plans,
                                  [plan]: { total: parseFloat(e.target.value) }
                                }
                              }
                            })}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'promotion' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-4">Promotion Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={editingPhone.promotion?.type || ''}
                          onChange={e => {
                            const type = e.target.value;
                            setEditingPhone({
                              ...editingPhone,
                              promotion: type ? {
                                type,
                                text: editingPhone.promotion?.text || '',
                                validFrom: editingPhone.promotion?.validFrom || new Date().toISOString().split('T')[0],
                                validTo: editingPhone.promotion?.validTo || new Date().toISOString().split('T')[0]
                              } : undefined
                            });
                          }}
                          className="w-full p-2 border rounded-lg"
                        >
                          <option value="">No Promotion</option>
                          <option value="SALE">Sale</option>
                          <option value="BOGO">BOGO</option>
                          <option value="DEAL">Deal</option>
                        </select>
                      </div>
                      {editingPhone.promotion && (
                        <>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Promotion Text
                            </label>
                            <input
                              type="text"
                              value={editingPhone.promotion.text}
                              onChange={e => setEditingPhone({
                                ...editingPhone,
                                promotion: {
                                  ...editingPhone.promotion,
                                  text: e.target.value
                                }
                              })}
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Valid From
                            </label>
                            <input
                              type="date"
                              value={editingPhone.promotion.validFrom?.split('T')[0] || ''}
                              onChange={e => setEditingPhone({
                                ...editingPhone,
                                promotion: {
                                  ...editingPhone.promotion,
                                  validFrom: e.target.value
                                }
                              })}
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Valid To
                            </label>
                            <input
                              type="date"
                              value={editingPhone.promotion.validTo?.split('T')[0] || ''}
                              onChange={e => setEditingPhone({
                                ...editingPhone,
                                promotion: {
                                  ...editingPhone.promotion,
                                  validTo: e.target.value
                                }
                              })}
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-[#ff6900]" />
                      Display Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <input
                          type="text"
                          value={specifications.display.type}
                          onChange={e => setSpecifications({
                            ...specifications,
                            display: { ...specifications.display, type: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g., AMOLED, IPS LCD"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Size
                        </label>
                        <input
                          type="text"
                          value={specifications.display.size}
                          onChange={e => setSpecifications({
                            ...specifications,
                            display: { ...specifications.display, size: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g., 6.1 inches"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Resolution
                        </label>
                        <input
                          type="text"
                          value={specifications.display.resolution}
                          onChange={e => setSpecifications({
                            ...specifications,
                            display: { ...specifications.display, resolution: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g., 1170 x 2532 pixels"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Protection
                        </label>
                        <input
                          type="text"
                          value={specifications.display.protection}
                          onChange={e => setSpecifications({
                            ...specifications,
                            display: { ...specifications.display, protection: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          
                          placeholder="e.g., Gorilla Glass Victus"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Features
                        </label>
                        <input
                          type="text"
                          value={specifications.display.features}
                          onChange={e => setSpecifications({
                            ...specifications,
                            display: { ...specifications.display, features: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g., HDR10, 120Hz refresh rate"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#ff6900]" />
                      Camera Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Main Camera
                        </label>
                        <input
                          type="text"
                          value={specifications.camera.main}
                          onChange={e => setSpecifications({
                            ...specifications,
                            camera: { ...specifications.camera, main: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g., Triple 50 MP (wide) + 12 MP (ultrawide) + 12 MP (telephoto)"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Features
                        </label>
                        <input
                          type="text"
                          value={specifications.camera.features}
                          onChange={e => setSpecifications({
                            ...specifications,
                            camera: { ...specifications.camera, features: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g., Dual-pixel PDAF, OIS"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Video
                        </label>
                        <input
                          type="text"
                          value={specifications.camera.video}
                          onChange={e => setSpecifications({
                            ...specifications,
                            camera: { ...specifications.camera, video: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g., 4K@60fps, HDR"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Selfie Camera
                        </label>
                        <input
                          type="text"
                          value={specifications.camera.selfie}
                          onChange={e => setSpecifications({
                            ...specifications,
                            camera: { ...specifications.camera, selfie: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g., 12 MP, f/2.2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <Battery className="w-4 h-4 text-[#ff6900]" />
                      Battery Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <input
                          type="text"
                          value={specifications.battery.type}
                          onChange={e => setSpecifications({
                            ...specifications,
                            battery: { ...specifications.battery, type: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g., Li-Ion 4500 mAh"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Charging
                        </label>
                        <input
                          type="text"
                          value={specifications.battery.charging}
                          onChange={e => setSpecifications({
                            ...specifications,
                            battery: { ...specifications.battery, charging: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g., 25W wired, 15W wireless"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Standby
                        </label>
                        <input
                          type="text"
                          value={specifications.battery.standby}
                          onChange={e => setSpecifications({
                            ...specifications,
                            battery: { ...specifications.battery, standby: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g., Up to 24 hours"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Talk Time
                        </label>
                        <input
                          type="text"
                          value={specifications.battery.talkTime}
                          onChange={e => setSpecifications({
                            ...specifications,
                            battery: { ...specifications.battery, talkTime: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g., Up to 20 hours"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff6900] text-white rounded-lg hover:bg-[#e05e00] flex items-center gap-2"
                >
                  <Check size={20} />
                  {editingPhone.id ? 'Update' : 'Add'} Phone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Storage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {phonesList.map(phone => (
                <tr key={phone.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={phone.imageUrl}
                          alt={phone.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {phone.name}
                        </div>
                        <div className="text-sm text-gray-500">{phone.color}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {phone.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {phone.storage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${phone.srp.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(phone)}
                        className="text-[#ff6900] hover:text-[#e05e00] p-1 hover:bg-[#ff6900]/10 rounded-full transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(phone.id)}
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PhoneManager;