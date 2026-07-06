import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, Eye, Star } from 'lucide-react';

export default function BookCard({ book }) {
  const { addToCart } = useContext(CartContext);
  const [adding, setAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigating to details page
    setAdding(true);
    setErrorMsg('');
    try {
      await addToCart(book.id, 1);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add to cart');
      // Clear error after 3 seconds
      setTimeout(() => setErrorMsg(''), 3000);
    } finally {
      setAdding(false);
    }
  };

  // Fallback image if cover URL is missing
  const coverUrl = book.cover_image_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60';

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-card flex flex-col h-full relative group">
      {/* Cover Image Wrapper */}
      <Link to={`/books/${book.id}`} className="relative block overflow-hidden bg-gray-100 pt-[130%]">
        <img
          src={coverUrl}
          alt={book.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="h-3.5 w-3.5" /> View Details
          </span>
        </div>
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm">
          {book.genre || 'E-Book'}
        </span>
      </Link>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/books/${book.id}`} className="hover:text-green-600 transition-colors">
          <h3 className="font-semibold text-gray-800 text-base line-clamp-1" title={book.title}>
            {book.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs mt-1 mb-2">By {book.author}</p>

        {/* Rating Row */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex text-amber-400">
            <Star className="h-3.5 w-3.5 fill-current" />
            <Star className="h-3.5 w-3.5 fill-current" />
            <Star className="h-3.5 w-3.5 fill-current" />
            <Star className="h-3.5 w-3.5 fill-current" />
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-[11px] text-gray-400 font-medium">(5.0)</span>
        </div>

        {/* Price & Cart Trigger */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <span className="text-lg font-bold text-gray-900">${parseFloat(book.price).toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`p-2 rounded-xl transition-all shadow-sm ${
              adding
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
            }`}
            title="Add to Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="absolute bottom-16 left-4 right-4 bg-red-50 text-red-600 text-xs py-1.5 px-2 rounded-lg text-center border border-red-100 z-10 animate-pulse">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
