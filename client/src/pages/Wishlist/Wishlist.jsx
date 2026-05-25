import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { FiTrash2 } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { initAuth } from '../../store/slices/authSlice'; // To refresh user data if needed

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const dispatch = useDispatch();

  const fetchWishlist = async () => {
    try {
      const res = await userAPI.getWishlist();
      setWishlistItems(res.data.wishlist || res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      await userAPI.toggleWishlist(id);
      setWishlistItems(wishlistItems.filter(item => (item._id || item.id) !== id));
      dispatch(initAuth()); // Refresh auth user state to update header badge
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-20 text-center font-sans">Loading wishlist...</div>;

  return (
    <div className="container mx-auto px-4 py-12 font-sans max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-serif text-[#0F2C59] mb-8 text-center">My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 border border-gray-200">
          <p className="text-gray-600 mb-6">Your wishlist is empty.</p>
          <Link to="/" className="bg-[#0F2C59] text-white px-8 py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#144272] transition-colors rounded-sm">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {wishlistItems.map(product => (
            <div key={product._id} className="group relative">
              <div className="relative overflow-hidden bg-gray-100 aspect-[4/5] mb-4">
                <Link to={`/product/${product.slug}`}>
                  <img src={product.images?.[0] || product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={product.name} />
                </Link>
                <button 
                  onClick={() => handleRemove(product._id || product.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-colors z-10"
                >
                  <FiTrash2 size={16} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button 
                    onClick={(e) => { e.preventDefault(); addToCart(product); }}
                    className="w-full py-2 text-sm font-bold text-[#0F2C59] hover:text-[#B78472]"
                  >
                    MOVE TO BAG
                  </button>
                </div>
              </div>
              <h3 className="font-sans text-sm font-medium text-[#0F2C59] mb-1 truncate">{product.name}</h3>
              <p className="font-bold text-[#B78472]">₹{(product.discountPrice > 0 ? product.discountPrice : product.price).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
