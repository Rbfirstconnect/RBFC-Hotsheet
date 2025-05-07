import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await login(email, password);
      if (error) {
        setError(error);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://videocdn.cdnpk.net/videos/a7d57678-334e-5da6-a382-27af0a8aedd4/square/previews/clear/large.mp4?token=exp=1746633853~hmac=dcfde49c5f613882be8deef5b2ec7460f8f0aafc58af31ff1761838611f26a7f"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Login Form */}
      <div className="max-w-md w-full space-y-8 bg-white/10 p-8 rounded-xl shadow-lg backdrop-blur-md relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="https://i.ibb.co/zVRB6xW1/Adobe-Express-file-1.png" 
              alt="Logo"
              className="h-16 w-auto"
            />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Device Hotsheet
          </h2>
          <p className="text-sm text-gray-300">
            Sign in to access your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 text-red-200 p-3 rounded-lg text-sm backdrop-blur-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300/20 placeholder-gray-400 text-white bg-white/10 rounded-t-md focus:outline-none focus:ring-[#ff6900] focus:border-[#ff6900] focus:z-10 sm:text-sm backdrop-blur-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300/20 placeholder-gray-400 text-white bg-white/10 rounded-b-md focus:outline-none focus:ring-[#ff6900] focus:border-[#ff6900] focus:z-10 sm:text-sm backdrop-blur-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#ff6900] to-[#ff8b3d] hover:from-[#ff8b3d] hover:to-[#ff6900] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6900] transition-all duration-300 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-white/60 text-sm backdrop-blur-sm bg-black/20">
        © {new Date().getFullYear()} Boost Mobile Device Hotsheet. All rights reserved.
      </div>
    </div>
  );
};

export default Login;