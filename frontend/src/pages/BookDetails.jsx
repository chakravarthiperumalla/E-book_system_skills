import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Star, BookOpen, ShoppingCart, ArrowLeft, Loader2, Sparkles, BookCopy } from 'lucide-react';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showSampleModal, setShowSampleModal] = useState(false);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/books/${id}`);
      setBook(response.data);
    } catch (err) {
      console.error('Error fetching book details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      setErrorMsg('Please sign in to add items to your cart.');
      return;
    }
    setAdding(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await addToCart(book.id, 1);
      setSuccessMsg('Successfully added to cart!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add to cart.');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      setErrorMsg('Please sign in to buy books.');
      return;
    }
    try {
      await addToCart(book.id, 1);
      navigate('/cart');
    } catch (err) {
      setErrorMsg('Failed to process buy now.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
        <p className="text-gray-500 text-sm">Fetching book information...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto">
        <h4 className="text-lg font-bold text-gray-800">Book Not Found</h4>
        <Link to="/" className="text-green-600 font-semibold mt-4 inline-block hover:underline">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const coverUrl = book.cover_image_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60';

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </button>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 relative overflow-hidden">
        {/* Cover Section */}
        <div className="md:col-span-4 flex flex-col items-center">
          <div className="w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50 relative">
            <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" />
          </div>
          {/* Rating Summary */}
          <div className="mt-4 text-center">
            <div className="flex justify-center text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-xs text-gray-400 font-medium mt-1 inline-block">4.8 out of 5 stars (124 reviews)</span>
          </div>
        </div>

        {/* Info & CTA Section */}
        <div className="md:col-span-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="inline-block bg-green-50 text-green-700 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {book.genre || 'E-Book'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">{book.title}</h1>
            <p className="text-gray-500 text-sm">Written by <span className="font-semibold text-gray-800">{book.author}</span></p>

            <div className="pt-3 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</h4>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">{book.description || 'No description available.'}</p>
            </div>

            {/* Book specs */}
            <div className="grid grid-cols-2 gap-4 pt-4 text-xs border-t border-gray-100 text-gray-500">
              <div>
                <span className="font-semibold text-gray-700">ISBN:</span> {book.isbn || 'N/A'}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Format:</span> PDF / EPUB
              </div>
              <div>
                <span className="font-semibold text-gray-700">File Size:</span> ~ 12 MB
              </div>
              <div>
                <span className="font-semibold text-gray-700">Delivery:</span> Instant download
              </div>
            </div>
          </div>

          {/* Pricing & CTA Panel */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div>
              <span className="text-xs text-gray-400 font-medium">Digital List Price</span>
              <div className="text-2xl sm:text-3xl font-black text-gray-900">${parseFloat(book.price).toFixed(2)}</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowSampleModal(true)}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <BookOpen className="h-4 w-4 text-green-600" /> Read Sample
              </button>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="bg-green-50 hover:bg-green-100 text-green-700 px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Status Message boxes */}
          {successMsg && (
            <div className="p-3 bg-green-50 text-green-700 border border-green-100 rounded-xl text-center text-xs font-semibold animate-pulse">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-1">
              <span>{errorMsg}</span>
              {!user && (
                <Link to="/login" className="underline font-bold hover:text-red-800">
                  Login here
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Free Sample Modal */}
      {showSampleModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-gray-100 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <BookCopy className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight">Sample Preview: {book.title}</h3>
                  <p className="text-[11px] text-gray-400">Viewing: Chapter 1 Extract</p>
                </div>
              </div>
              <button
                onClick={() => setShowSampleModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-all"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - Scrollable chapter mock */}
            <div className="p-6 overflow-y-auto text-sm text-gray-700 space-y-4 leading-relaxed max-h-[60vh] select-none">
              <div className="text-center py-6 border-b border-gray-100 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{book.title}</h2>
                <p className="text-gray-500 text-xs mt-1">By {book.author}</p>
                <p className="text-gray-400 text-[10px] mt-2">Licensed Reader Preview</p>
              </div>

              <h3 className="font-bold text-gray-800 text-base mt-4 border-l-4 border-green-500 pl-2">Chapter 1: The Code Foundation</h3>
              <p>
                Every coding environment represents a micro-cosmos of syntax, variables, compiler limits, and logical flows. Understanding how architectures stack together is not just a secondary skill; it is the cornerstone of building durable software.
              </p>
              <p>
                When starting with Python or JavaScript, we are often shielded from memory pooling, SSL bindings, or thread pools. Systems like FastAPI handle requests asynchronously inside single-threaded process containers. Behind the scenes, these models yield control back to the central event loops during IO boundaries.
              </p>
              <p className="bg-gray-50 p-4 rounded-xl border border-gray-100 font-mono text-xs text-gray-600 block">
                # Example: Asynchronous API Calls<br />
                async def fetch_ebook_catalog(genre: str):<br />
                &nbsp;&nbsp;&nbsp;&nbsp;async with db.session() as session:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return await session.query_books(genre=genre)
              </p>
              <p>
                This allows systems to scale effortlessly. The challenge, however, shifts from balancing server execution counts to handling database connections, ensuring connection pools are healthy, and indexing primary columns.
              </p>
              <p className="text-center text-gray-400 text-xs py-4 italic border-t border-gray-50">
                --- End of Chapter 1 Sample Preview ---
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs text-gray-500">Page 1 of 1</span>
              <button
                onClick={handleBuyNow}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                Buy Full E-Book (${parseFloat(book.price).toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
