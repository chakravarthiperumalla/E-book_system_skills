import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Helper autofills for demo/testing
  const fillCredentials = (type) => {
    if (type === 'admin') {
      setEmail('admin@ebook.com');
      setPassword('admin123');
    } else {
      setEmail('user@ebook.com');
      setPassword('user123');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-2">Log in to access your digital library</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-start gap-2 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Logging In...' : (
              <>
                <LogIn className="h-5 w-5" /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold hover:underline">
            Sign up now
          </Link>
        </div>

        {/* Demo Fast Autofills */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Quick Testing Access</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => fillCredentials('user')}
              className="text-xs bg-green-50 text-green-700 hover:bg-green-100 font-medium px-3.5 py-2 rounded-xl transition-all"
            >
              Fill Customer Demo
            </button>
            <button
              onClick={() => fillCredentials('admin')}
              className="text-xs bg-red-50 text-red-700 hover:bg-red-100 font-medium px-3.5 py-2 rounded-xl transition-all"
            >
              Fill Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
