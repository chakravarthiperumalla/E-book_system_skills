import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, Trash2, Plus, Minus, Tag, ArrowRight, BookOpen } from 'lucide-react';

export default function Cart() {
  const {
    cartItems,
    couponCode,
    discountPercent,
    couponError,
    cartSubtotal,
    discountAmount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon
  } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [promoInput, setPromoInput] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyCoupon(promoInput.trim());
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/payment-gateway');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-12 animate-[fadeIn_0.3s_ease-out]">
        <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800">Your Cart is Empty</h3>
        <p className="text-gray-500 text-sm mt-2 mb-6 px-4">Browse our premium catalog to add books to your shopping list.</p>
        <Link
          to="/"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm transition-all"
        >
          Browse E-Books
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
        <ShoppingCart className="h-7 w-7 text-green-600" /> Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Item Details</span>
            </div>

            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => {
                const book = item.book;
                const cover = book.cover_image_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60';
                return (
                  <div key={item.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">
                    {/* Cover image */}
                    <div className="w-16 sm:w-20 aspect-[3/4] rounded-lg overflow-hidden border border-gray-100 shrink-0">
                      <img src={cover} alt={book.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Book Metadata */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/books/${book.id}`} className="hover:text-green-600 transition-colors">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate" title={book.title}>
                          {book.title}
                        </h4>
                      </Link>
                      <p className="text-gray-400 text-xs mt-0.5">By {book.author}</p>
                      <span className="inline-block mt-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        {book.genre || 'E-Book'}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-200 text-gray-500 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1 text-sm font-semibold text-gray-700">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-200 text-gray-500 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Price and delete button */}
                    <div className="text-right shrink-0 flex flex-col items-end justify-center min-w-[70px]">
                      <div className="font-bold text-gray-900 text-sm sm:text-base">
                        ${(book.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 mt-1 rounded-lg hover:bg-red-50 transition-all"
                        title="Remove book"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary & Promos */}
        <div className="lg:col-span-1 space-y-6">
          {/* Promo code card */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-1.5 pb-2 border-b border-gray-100 text-sm">
              <Tag className="h-4 w-4 text-green-600" /> Apply Discount Coupon
            </h3>

            {couponCode ? (
              <div className="bg-green-50 text-green-700 p-3 rounded-xl border border-green-100 flex items-center justify-between text-xs font-semibold">
                <span>Coupon Applied: <span className="underline">{couponCode}</span> ({discountPercent}% Off)</span>
                <button onClick={removeCoupon} className="text-red-500 hover:text-red-700 font-bold ml-2">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. TECH30"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all uppercase"
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition-all"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && <p className="text-red-500 text-xs font-medium animate-pulse">{couponError}</p>}
          </div>

          {/* Pricing summary */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-base pb-3 border-b border-gray-100">Order Summary</h3>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">${cartSubtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Standard Sales Tax (5%)</span>
                <span className="font-semibold text-gray-800">${(cartSubtotal * 0.05).toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-gray-900">
              <span className="font-semibold text-base">Total Amount</span>
              <span className="font-extrabold text-xl sm:text-2xl text-green-600">
                ${(cartTotal + (cartSubtotal * 0.05)).toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
            >
              Proceed to Secure Checkout <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
