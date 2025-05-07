import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneCatalog from './components/PhoneCatalog';
import Header from './components/Header';
import PhoneManager from './components/admin/PhoneManager';
import UserManager from './components/admin/UserManager';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Store, Users, Smartphone } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'store' | 'phones' | 'users'>('store');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const tabVariants = {
    inactive: { scale: 0.95, opacity: 0.7 },
    active: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 25 }
    },
    tap: { scale: 0.97 }
  };

  const handleTabChange = (tab: 'store' | 'phones' | 'users') => {
    setActiveTab(tab);
  };
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#ff6900] rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 bg-[#ff6900] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Login />
      </motion.div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover"
      >
        <source
           src="https://videocdn.cdnpk.net/videos/a7d57678-334e-5da6-a382-27af0a8aedd4/square/previews/clear/large.mp4?token=exp=1746633853~hmac=dcfde49c5f613882be8deef5b2ec7460f8f0aafc58af31ff1761838611f26a7f"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          onSearch={setSearchQuery} 
          onAdminClick={() => setActiveTab(activeTab === 'store' ? 'phones' : 'store')}
          showAdmin={activeTab !== 'store'}
        />
        
        <main className="container mx-auto px-4 py-8 flex-1">
          <AnimatePresence mode="wait">
            {isAdmin && activeTab !== 'store' ? (
              <motion.div
                key="admin-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/90 rounded-2xl shadow-md overflow-hidden backdrop-blur-md"
              >
                <div className="bg-gradient-to-r from-[#ff6900] to-[#ff8b3d] p-4">
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex gap-2 mb-0"
                  >
                    <motion.button
                      variants={itemVariants}
                      animate={activeTab === 'phones' ? 'active' : 'inactive'}
                      whileTap="tap"
                      onClick={() => handleTabChange('phones')}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        activeTab === 'phones'
                          ? 'bg-white text-[#ff6900] shadow-lg'
                          : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Manage Phones</span>
                    </motion.button>
                    
                    <motion.button
                      variants={itemVariants}
                      animate={activeTab === 'users' ? 'active' : 'inactive'}
                      whileTap="tap"
                      onClick={() => handleTabChange('users')}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        activeTab === 'users'
                          ? 'bg-white text-[#ff6900] shadow-lg'
                          : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Manage Users</span>
                    </motion.button>
                    
                    <motion.button
                      variants={itemVariants}
                      animate={activeTab === 'store' ? 'active' : 'inactive'}
                      whileTap="tap"
                      onClick={() => handleTabChange('store')}
                      className="ml-auto px-6 py-3 rounded-lg text-sm font-medium bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all flex items-center gap-2"
                    >
                      <Store className="w-4 h-4" />
                      <span>Back to Store</span>
                    </motion.button>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <AnimatePresence mode="wait">
                    {activeTab === 'phones' ? (
                      <motion.div
                        key="phone-manager"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: "spring", damping: 25 }}
                      >
                        <PhoneManager />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="user-manager"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: "spring", damping: 25 }}
                      >
                        <UserManager />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="store"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PhoneCatalog searchQuery={searchQuery} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-[#ff6900] to-[#ff8b3d] text-white py-6 mt-auto relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:24px]"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-sm"
              >
                <p className="font-medium">© 2025 Boost Mobile. All rights reserved.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex gap-6"
              >
                <a href="#" className="text-white hover:text-white/70 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-white hover:text-white/70 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-white hover:text-white/70 transition-colors">
                  Contact Us
                </a>
              </motion.div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AnimatePresence>
        <AppContent />
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;