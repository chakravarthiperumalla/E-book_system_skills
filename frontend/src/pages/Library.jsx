import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Download, Loader2, Sparkles, FolderOpen, History } from 'lucide-react';

export default function Library() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('books');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchLibrary();
      fetchOrders();
    }
  }, [user]);

  const fetchLibrary = async () => {
    try {
      const response = await axios.get('/api/library');
      setLibraryBooks(response.data);
    } catch (err) {
      console.error('Error fetching library:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/my-orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching order history:', err);
    }
  };

  const handleDownload = async (bookId) => {
    try {
      const response = await axios.get(`/api/library/download/${bookId}`);
      const downloadUrl = response.data.download_url;
      
      // Trigger dynamic browser download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', ''); // Triggers file download behavior
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      alert('Could not verify download credentials. Please contact support.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
        <p className="text-gray-500 text-sm">Accessing your secure digital library vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* Header section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">My Reader Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage downloads, track orders, and access invoices.</p>
      </div>

      {/* Tabs selectors */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('books')}
          className={`flex items-center gap-1.5 py-4 px-6 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'books'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FolderOpen className="h-4 w-4" /> My Library ({libraryBooks.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 py-4 px-6 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <History className="h-4 w-4" /> Order History ({orders.length})
        </button>
      </div>

      {/* Tab: Library Books Grid */}
      {activeTab === 'books' && (
        <div>
          {libraryBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {libraryBooks.map((book) => {
                const cover = book.cover_image_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60';
                return (
                  <div key={book.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between h-full relative group">
                    <div className="space-y-4">
                      {/* Cover */}
                      <div className="aspect-[3/4] rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative">
                        <img src={cover} alt={book.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase">
                          {book.genre || 'E-Book'}
                        </span>
                      </div>
                      
                      {/* Meta */}
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{book.title}</h4>
                        <p className="text-gray-400 text-xs mt-0.5">By {book.author}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(book.id)}
                      className="w-full bg-green-50 hover:bg-green-600 hover:text-white text-green-600 rounded-xl py-2.5 mt-4 text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-3xl py-16 px-4 text-center max-w-md mx-auto shadow-sm">
              <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-gray-800">Your Library is empty</h4>
              <p className="text-gray-500 text-xs mt-1 mb-6">
                You haven't purchased any E-Books yet. Once paid, they will appear here instantly.
              </p>
              <Link to="/" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all">
                Find E-Books
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab: Order History */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100">
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Transaction Date</th>
                    <th className="py-4 px-6">Transaction Ref</th>
                    <th className="py-4 px-6">Payment Status</th>
                    <th className="py-4 px-6 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-900">#{order.id}</td>
                      <td className="py-4 px-6 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-gray-400 truncate max-w-[120px]" title={order.stripe_session_id}>
                        {order.stripe_session_id || 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.payment_status === 'paid'
                            ? 'bg-green-50 text-green-700'
                            : order.payment_status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-gray-900">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center text-gray-500 text-sm">
              No orders found in your account history.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
