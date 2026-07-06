import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/BookCard';
import { Search, Loader2, Sparkles, Filter } from 'lucide-react';

export default function Home() {
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Extract search query parameter
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  // Genres list for sidebar
  const genres = ['Technology', 'Design', 'Business', 'Lifestyle'];

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, selectedGenre, sortBy]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      // Build API query parameters
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedGenre) params.genre = selectedGenre;

      const response = await axios.get('/api/books', { params });
      let loadedBooks = response.data;

      // Apply sorting on client side
      if (sortBy === 'price-asc') {
        loadedBooks.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        loadedBooks.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'newest') {
        loadedBooks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      setBooks(loadedBooks);
    } catch (err) {
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Featured Promotion Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1 bg-green-500/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <Sparkles className="h-3 w-3" /> Special Summer Sale
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Expand Your Digital Horizon</h1>
          <p className="mt-3 text-green-100 text-sm sm:text-base leading-relaxed">
            Get 30% off all technology and programming manuals! Use code <span className="font-bold text-white bg-green-900/30 px-2 py-0.5 rounded border border-green-500/20">TECH30</span> at checkout.
          </p>
        </div>
        {/* Background visual accents */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 hidden md:block">
          <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3a9 9 0 0 0-9 9v7a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H5v-2a7 7 0 0 1 14 0v2h-3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-7a9 9 0 0 0-9-9z"/>
          </svg>
        </div>
      </div>

      {/* Catalog Filters and Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <h3 className="font-semibold text-gray-800 flex items-center gap-1.5 pb-3 border-b border-gray-100">
              <Filter className="h-4 w-4 text-green-600" /> Filter & Sort
            </h3>

            {/* Sort Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              >
                <option value="">Featured</option>
                <option value="newest">Newest Titles</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Genre Selectors */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Genres</label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedGenre('')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                    selectedGenre === ''
                      ? 'bg-green-50 text-green-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  All Genres
                </button>
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                      selectedGenre === genre
                        ? 'bg-green-50 text-green-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* E-Books Grid */}
        <div className="lg:col-span-3">
          {searchQuery && (
            <div className="mb-4 text-sm text-gray-500">
              Showing search results for "<span className="font-semibold text-gray-800">{searchQuery}</span>"
              <button
                onClick={() => {
                  const url = new URL(window.location);
                  url.searchParams.delete('search');
                  window.history.pushState({}, '', url);
                  window.location.reload();
                }}
                className="ml-2 text-green-600 font-medium hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
              <p className="text-gray-500 text-sm">Loading books from catalog...</p>
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-[fadeIn_0.3s_ease-out]">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-3xl py-20 px-4 text-center shadow-sm">
              <p className="text-gray-400 text-2xl mb-2">📚</p>
              <h4 className="text-lg font-bold text-gray-800">No books found</h4>
              <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
                We couldn't find any books matching your criteria. Try adjusting your filters or search keywords.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
