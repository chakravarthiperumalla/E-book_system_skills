import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Plus, Pencil, Archive, BookOpen, Receipt, RefreshCw, X, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, authLoading, navigate]);

  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for Book Add/Edit
  const [showForm, setShowForm] = useState(false);
  const [editBookId, setEditBookId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formGenre, setFormGenre] = useState('');
  const [formIsbn, setFormIsbn] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCover, setFormCover] = useState('');
  const [formPreview, setFormPreview] = useState('');
  const [formSource, setFormSource] = useState('');
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user, activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'books') {
        const response = await axios.get('/api/books?admin_view=true');
        setBooks(response.data);
      } else {
        const response = await axios.get('/api/orders/all');
        setOrders(response.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateForm = () => {
    setEditBookId(null);
    setFormTitle('');
    setFormAuthor('');
    setFormDesc('');
    setFormGenre('Technology');
    setFormIsbn('');
    setFormPrice('');
    setFormCover('');
    setFormPreview('');
    setFormSource('');
    setFormError('');
    setFormSuccess('');
    setShowForm(true);
  };

  const handleOpenEditForm = (book) => {
    setEditBookId(book.id);
    setFormTitle(book.title);
    setFormAuthor(book.author);
    setFormDesc(book.description || '');
    setFormGenre(book.genre || 'Technology');
    setFormIsbn(book.isbn || '');
    setFormPrice(book.price.toString());
    setFormCover(book.cover_image_url || '');
    setFormPreview(book.preview_file_url || '');
    setFormSource(book.source_file_url || '');
    setFormError('');
    setFormSuccess('');
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const payload = {
      title: formTitle,
      author: formAuthor,
      description: formDesc,
      genre: formGenre,
      isbn: formIsbn,
      price: parseFloat(formPrice),
      cover_image_url: formCover,
      preview_file_url: formPreview,
      source_file_url: formSource,
      is_active: true
    };

    try {
      if (editBookId) {
        // Edit existing book
        await axios.put(`/api/books/${editBookId}`, payload);
        setFormSuccess('Book updated successfully!');
      } else {
        // Create new book
        await axios.post('/api/books', payload);
        setFormSuccess('Book created successfully!');
      }
      setTimeout(() => {
        setShowForm(false);
        fetchAdminData();
      }, 1000);
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to save E-Book.');
    }
  };

  const handleArchiveBook = async (bookId) => {
    if (window.confirm('Are you sure you want to archive/disable this book?')) {
      try {
        await axios.delete(`/api/books/${bookId}`);
        fetchAdminData();
      } catch (err) {
        alert('Failed to archive book.');
      }
    }
  };

  const handleRefundOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to issue a refund for this order?')) {
      try {
        await axios.post(`/api/orders/refund/${orderId}`);
        fetchAdminData();
      } catch (err) {
        alert('Failed to refund order.');
      }
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
        <p className="text-gray-500 text-sm">Authenticating admin account...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* Admin header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-green-600 animate-pulse" /> E-Book Hub Control Center
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage catalog listings, pricing, and audit payment transactions.</p>
        </div>
        
        {activeTab === 'books' && (
          <button
            onClick={handleOpenCreateForm}
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-5 py-3 text-sm font-semibold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="h-4 w-4" /> Add New E-Book
          </button>
        )}
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
          <BookOpen className="h-4 w-4" /> Manage Catalog ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 py-4 px-6 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Receipt className="h-4 w-4" /> Auditing Orders ({orders.length})
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
        </div>
      ) : activeTab === 'books' ? (
        /* Catalog list table */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100">
                  <th className="py-4 px-6">Book Title</th>
                  <th className="py-4 px-6">Author</th>
                  <th className="py-4 px-6">Genre</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Catalog Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-900">{book.title}</td>
                    <td className="py-4 px-6 text-gray-500">{book.author}</td>
                    <td className="py-4 px-6">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {book.genre || 'Technology'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold">${parseFloat(book.price).toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        book.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {book.is_active ? 'Active' : 'Archived'}
                      </span>
                    </td>
                    <td className="py-4 px-6 flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditForm(book)}
                        className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-gray-100 transition-all"
                        title="Edit Book details"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleArchiveBook(book.id)}
                        disabled={!book.is_active}
                        className={`p-2 rounded-lg transition-all ${
                          book.is_active
                            ? 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                            : 'text-gray-200 cursor-not-allowed'
                        }`}
                        title="Archive E-Book"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Orders list table */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Purchased Date</th>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Total Amount</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-900">#{order.id}</td>
                    <td className="py-4 px-6 text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-gray-400 truncate max-w-[120px]" title={order.stripe_session_id}>
                      {order.stripe_session_id || 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.payment_status === 'paid'
                          ? 'bg-green-50 text-green-700'
                          : order.payment_status === 'refunded'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-gray-900">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {order.payment_status === 'paid' ? (
                        <button
                          onClick={() => handleRefundOrder(order.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
                        >
                          Issue Refund
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs">No action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Book Form Dialog Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-gray-100 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-base">{editBookId ? 'Edit E-Book Metadata' : 'Add New E-Book to Catalog'}</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 max-h-[70vh] text-sm">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="p-3 bg-green-50 border border-green-100 text-green-600 rounded-xl text-xs font-medium">
                  {formSuccess}
                </div>
              )}

              {/* Title & Author */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Book Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Python Pro"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Author</label>
                  <input
                    type="text"
                    required
                    placeholder="John Smith"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  placeholder="Master advanced coding techniques..."
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                />
              </div>

              {/* Genre, ISBN & Price */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Genre</label>
                  <select
                    value={formGenre}
                    onChange={(e) => setFormGenre(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">ISBN</label>
                  <input
                    type="text"
                    placeholder="978-3-16..."
                    value={formIsbn}
                    onChange={(e) => setFormIsbn(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="19.99"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Asset URL Inputs */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formCover}
                  onChange={(e) => setFormCover(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Preview PDF URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="/static/previews/preview.pdf"
                    value={formPreview}
                    onChange={(e) => setFormPreview(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Book PDF URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="/static/books/book.pdf"
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold text-sm shadow-md transition-all mt-4"
              >
                {editBookId ? 'Save Modifications' : 'Publish E-Book'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
