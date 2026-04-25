import { useState } from "react";
import { FaHamburger, FaChevronDown, FaChevronUp, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GiTireIronCross } from "react-icons/gi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="fixed top-0 w-full z-50 bg-white text-gray-800 shadow-md transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo & Location */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoErvIxAIWybuxDrbVZuRTz1B3ZaYWZTSqMw&s"
              alt="Logo"
              className="w-32 h-auto object-contain"
            />
          </Link>
          
          <div className="hidden lg:flex items-center gap-2 text-sm group cursor-pointer">
            <span className="font-bold border-b-2 border-black hover:text-orange-500 transition-colors">Other</span>
            <span className="text-gray-500 truncate max-w-[200px] group-hover:text-gray-700">Gurgaon, Haryana, India</span>
            <FaChevronDown className="text-orange-500" />
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-base">
          <Link to="/chef-search" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
            <span className="text-xl">🔍</span>
            Search
          </Link>
          
          <div className="relative group">
            <button className="flex items-center gap-2 hover:text-orange-500 transition-colors">
              <span>Offers</span>
              <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full font-bold">NEW</span>
            </button>
          </div>

          <Link to="/join-chefkart" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
            <span>Help</span>
          </Link>

          {token ? (
            <div className="flex items-center gap-4">
              {user?.role === 'admin' && (
                <Link to="/admin" className="hover:text-orange-500 transition-colors">Admin Dashboard</Link>
              )}
              <button onClick={handleLogout} className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
              <span>Sign In</span>
            </Link>
          )}

          <Link to="/cart" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
            <span className="text-2xl">🛒</span>
            <span>Cart</span>
          </Link>
          
          <Link to="/register-chef">
            <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Partner with us
            </button>
          </Link>
        </nav>

        {/* Hamburger Menu Button */}
        <button
          className="md:hidden text-gray-800 focus:outline-none p-2 rounded-md hover:bg-gray-100"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <FaHamburger className="w-6 h-6" />
        </button>
      </div>

      {/* Slide-in Menu from the Right */}
      {isMenuOpen && (
        <div className="fixed top-0 right-0 h-full w-1/2 bg-white text-black shadow-lg z-50">
          <div className="flex flex-col p-5 space-y-4">
            {/* Close Button */}
            <button
              className="self-end focus:outline-none"
              onClick={toggleMenu}
              aria-label="Close Menu"
            >
              <GiTireIronCross className="w-10 h-10 text-black" />
            </button>

            {/* Menu Links */}
            <Link
              to="/about"
              className="text-lg font-bold hover:text-orange-500"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <hr />
            <Link
              to="/blog"
              className="text-lg font-bold hover:text-orange-500"
              onClick={toggleMenu}
            >
              Blog
            </Link>
            <hr />
            <Link
              to="/career"
              className="text-lg font-bold hover:text-orange-500"
              onClick={toggleMenu}
            >
              Career
            </Link>
            <hr />
            <Link
              to="/investor-relation"
              className="text-lg font-bold hover:text-orange-500"
              onClick={toggleMenu}
            >
              Investor Relations
            </Link>
            <hr />
            <Link
              to="/testimonial"
              className="text-lg font-bold hover:text-orange-500"
              onClick={toggleMenu}
            >
              Testimonials
            </Link>
            <hr />
            <button
              className="mt-4 inline-flex items-center bg-orange-500 border-0 py-2 px-4 rounded text-white text-lg"
              onClick={toggleMenu}
            >
              Contact Us
              <FaChevronRight className="ml-1" />
            </button>
          
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
