import { Link } from 'react-router-dom';
import { FiSearch, FiUser, FiHeart, FiShoppingCart, FiMenu, FiCamera } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { cartCount, setIsDrawerOpen } = useCart();

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top Announcement Bar */}
      <div className="bg-[#0F2C59] text-white text-xs py-2 px-4 flex justify-between items-center font-sans tracking-wide">
        <div className="hidden md:block">Free Shipping on orders over ₹2000 | Use Code: ELORE10</div>
        <div className="md:hidden text-center w-full">Free Shipping over ₹2000</div>
        <div className="hidden md:block">INR ₹ | EN</div>
      </div>

      {/* Main Header */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Mobile Menu Icon */}
        <button className="md:hidden text-[#0F2C59]">
          <FiMenu size={24} />
        </button>

        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-[#0F2C59] tracking-wider">
          Elore Jewels
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex items-center w-1/3 border border-gray-300 rounded-full px-4 py-2 bg-[#F9F9F9]">
          <FiSearch className="text-gray-500 mr-2" />
          <input 
            type="text" 
            placeholder="Search for 'Gold Bangles'..." 
            className="w-full bg-transparent outline-none text-sm font-sans"
          />
          <button className="text-gray-500 ml-2">
            <FiCamera />
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4 md:space-x-6 text-[#0F2C59]">
          <button className="hidden md:block hover:text-[#B78472] transition-colors"><FiUser size={22} /></button>
          <button className="relative hover:text-[#B78472] transition-colors">
            <FiHeart size={22} />
            <span className="absolute -top-1 -right-2 bg-[#D4AF37] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">0</span>
          </button>
          <button onClick={() => setIsDrawerOpen(true)} className="relative hover:text-[#B78472] transition-colors">
            <FiShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#D4AF37] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mega Menu Navigation (Desktop) */}
      <nav className="hidden md:flex justify-center space-x-8 py-3 border-t border-gray-100 font-sans text-sm font-medium text-[#144272]">
        <Link to="/collections/women" className="hover:text-[#B78472] uppercase tracking-wide">Women</Link>
        <Link to="/collections/men" className="hover:text-[#B78472] uppercase tracking-wide">Men</Link>
        <Link to="/collections/all" className="hover:text-[#B78472] uppercase tracking-wide">Collections</Link>
        <Link to="/collections/earrings" className="hover:text-[#B78472] uppercase tracking-wide">Earrings</Link>
        <Link to="/collections/necklaces" className="hover:text-[#B78472] uppercase tracking-wide">Necklaces</Link>
        <Link to="/collections/bangles" className="hover:text-[#B78472] uppercase tracking-wide">Bangles & Bracelets</Link>
        <Link to="/sale" className="text-red-600 hover:text-red-800 uppercase tracking-wide font-bold">Sale</Link>
      </nav>
    </header>
  );
};

export default Header;
