import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, BookOpen, User, LogOut, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate('/');
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="glass sticky top-0 z-40 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-green-600">
              <BookOpen className="h-6 w-6" />
              <span className="tracking-tight text-gray-900">E-Book<span className="text-green-600">Hub</span></span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search titles, authors, genres..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-green-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Nav Links & Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-green-600 font-medium text-sm transition-colors">
              Catalog
            </Link>

            {user && (
              <Link to="/library" className="text-gray-600 hover:text-green-600 font-medium text-sm transition-colors flex items-center gap-1">
                My Library
              </Link>
            )}

            {user && user.role === 'admin' && (
              <Link to="/admin" className="text-red-600 hover:text-red-700 font-semibold text-sm transition-colors flex items-center gap-1">
                <ShieldAlert className="h-4 w-4" />
                Admin
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-green-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-medium text-gray-500">Welcome,</span>
                  <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 transition-all"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-full text-sm font-medium transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
