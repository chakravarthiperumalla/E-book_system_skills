import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShieldCheck, CreditCard, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');
  
  const { user } = useContext(AuthContext);
  const { fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [cardNo, setCardNo] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Validate parameters
  useEffect(() => {
    if (!orderId || !sessionId) {
      navigate('/cart');
    }
  }, [orderId, sessionId, navigate]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      // Simulate API network latency
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await axios.post('/api/orders/confirm-payment', {
        order_id: parseInt(orderId),
        session_id: sessionId
      });

      if (response.data.status === 'success') {
        setPaidSuccess(true);
        // Refresh cart in context (should be empty now)
        fetchCart();
      } else {
        setErrorMsg('Payment verification failed.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to complete payment.');
    } finally {
      setLoading(false);
    }
  };

  if (paidSuccess) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white p-8 rounded-3xl border border-gray-100 shadow-lg mt-12 space-y-6 animate-[fadeIn_0.3s_ease-out]">
        <div className="inline-flex p-3 bg-green-50 text-green-600 rounded-full border border-green-100">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Order Completed Successfully!</h2>
        <p className="text-gray-500 text-sm">
          Thank you for your purchase. We have sent a confirmation email to <span className="font-semibold text-gray-800">{user?.email}</span>.
        </p>
        <p className="text-gray-500 text-sm">
          Your digital publications are now available inside your dashboard library for secure download.
        </p>
        <div className="pt-4 flex flex-col gap-2">
          <Link
            to="/library"
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
          >
            Access My Library <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="text-gray-500 hover:text-green-600 text-xs font-semibold hover:underline"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
        {/* Header lock banner */}
        <div className="bg-green-700 text-white py-4 px-6 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold text-sm">
            <Lock className="h-4 w-4" /> SECURE CHECKOUT
          </span>
          <span className="text-[11px] bg-green-600 px-2.5 py-1 rounded-full font-semibold border border-green-500">
            SSL encrypted
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="font-extrabold text-gray-800 text-lg">Enter Payment Details</h3>
            <p className="text-gray-400 text-xs mt-1">Order Ref: #{orderId} | Stripe Sandbox Mode</p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            {/* Cardholder name */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Cardholder Name</label>
              <input
                type="text"
                required
                placeholder="Sarah Reader"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              />
            </div>

            {/* Card number */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="4111 2222 3333 4444"
                  maxLength={19}
                  value={cardNo}
                  onChange={(e) => setCardNo(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Expiry Date</label>
                <input
                  type="text"
                  required
                  placeholder="MM/YY"
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">CVC / CVV</label>
                <input
                  type="password"
                  required
                  placeholder="•••"
                  maxLength={4}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3.5 font-semibold text-sm shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" /> Verifying Security...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4.5 w-4.5" /> PAY SECURELY
                </>
              )}
            </button>
          </form>

          {/* Checkout footnotes */}
          <div className="pt-4 border-t border-gray-50 flex items-center justify-center gap-1 text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
            <span>Powered by</span>
            <span className="text-green-600">Stripe Sandbox Integration</span>
          </div>
        </div>
      </div>
    </div>
  );
}
