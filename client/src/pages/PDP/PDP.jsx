import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShare2, FiTruck, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductBySlug, clearCurrentProduct } from '../../store/slices/productSlice';
import { userAPI } from '../../services/api';
import { initAuth } from '../../store/slices/authSlice';

const PDP = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { current: product, loading, error } = useSelector(state => state.product);
  
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const { addToCart } = useCart();
  const [tab, setTab] = useState('Description');

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (product && product.images) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  if (loading || !product) {
    return <div className="p-20 text-center font-sans">Loading product...</div>;
  }

  if (error) {
    return <div className="p-20 text-center font-sans text-red-500">Error loading product: {error}</div>;
  }

  const handleWishlist = async () => {
    try {
      await userAPI.toggleWishlist(product._id || product.id);
      dispatch(initAuth());
    } catch (err) {
      alert('Please login to add items to your wishlist.');
    }
  };

  const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-6 font-sans">
        <Link to="/" className="hover:text-[#B78472]">Home</Link> &gt; 
        <Link to="/collections/all" className="hover:text-[#B78472] ml-1">Collections</Link> &gt; 
        <span className="text-gray-800 ml-1">{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Side (Media Gallery) */}
        <div className="w-full md:w-1/2 flex flex-col md:flex-row-reverse gap-4">
          {/* Main Image */}
          <div className="w-full md:w-[85%] bg-gray-50 relative aspect-[4/5] overflow-hidden">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {product.discountPrice > 0 && product.discountPrice < product.price && (
              <span className="absolute top-4 left-4 bg-[#D4AF37] text-white text-xs font-bold px-3 py-1">
                SALE
              </span>
            )}
          </div>
          
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 w-full md:w-[15%] overflow-x-auto md:overflow-y-auto no-scrollbar">
            {product.images.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`${product.name} view ${idx}`} 
                onClick={() => setMainImage(img)}
                className={`w-16 h-20 md:w-20 md:h-24 object-cover cursor-pointer border-2 ${mainImage === img ? 'border-[#D4AF37]' : 'border-transparent'} hover:border-[#B78472] transition-colors`}
              />
            ))}
          </div>
        </div>

        {/* Right Side (Product Details) */}
        <div className="w-full md:w-1/2 font-sans">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl md:text-4xl font-serif text-[#0F2C59] mb-2">{product.name}</h1>
            <div className="flex space-x-3 text-gray-400">
              <button onClick={handleWishlist} className="hover:text-red-500 transition-colors"><FiHeart size={22} /></button>
              <button className="hover:text-[#0F2C59] transition-colors"><FiShare2 size={22} /></button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>

          <div className="mb-6">
            <div className="flex items-end space-x-4 mb-6 border-b border-gray-100 pb-6">
              <span className="text-3xl font-bold text-[#B78472]">₹{currentPrice.toFixed(2)}</span>
              {product.discountPrice > 0 && product.discountPrice < product.price && (
                <span className="text-lg text-gray-400 line-through">₹{product.price.toFixed(2)}</span>
              )}
            </div>
            
            <p className="text-gray-600 leading-relaxed text-sm mb-6">
              {product.description}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-3 w-full sm:w-2/3 mb-8">
            <button 
              onClick={() => addToCart(product, quantity)}
              className="bg-white border-2 border-[#0F2C59] text-[#0F2C59] hover:bg-gray-50 px-8 py-3 font-bold uppercase tracking-widest text-sm transition-colors"
            >
              Add to Bag
            </button>
            <button 
              onClick={() => {
                addToCart(product, quantity);
                navigate('/checkout');
              }}
              className="bg-[#0F2C59] border-2 border-[#0F2C59] text-white hover:bg-[#144272] px-8 py-3 font-bold uppercase tracking-widest text-sm transition-colors shadow-md"
            >
              Buy it Now
            </button>
          </div>

          {/* Delivery Checker */}
          <div className="mb-8 p-4 bg-[#F9F9F9] border border-gray-200">
            <h3 className="text-sm font-bold text-[#0F2C59] mb-3 flex items-center">
              <FiTruck className="mr-2" /> Check Delivery Availability
            </h3>
            <div className="flex">
              <input 
                type="text" 
                placeholder="Enter Pincode" 
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 border border-gray-300 p-2 text-sm outline-none focus:border-[#0F2C59]"
              />
              <button 
                onClick={() => {
                  if(!pincode) return;
                  setPincodeStatus('checking');
                  setTimeout(() => setPincodeStatus('available'), 800);
                }}
                className="bg-[#0F2C59] text-white px-4 text-sm font-medium hover:bg-[#144272] transition-colors"
              >
                Check
              </button>
            </div>
            {pincodeStatus === 'checking' && <p className="text-xs mt-2 text-gray-500">Checking...</p>}
            {pincodeStatus === 'available' && <p className="text-xs mt-2 text-green-600 font-bold">Delivery available within 3-5 business days.</p>}
          </div>

          {/* Accordions */}
          <div className="border-t border-gray-200">
            {['Description', 'Materials & Care', 'Offers'].map((item) => (
              <div key={item} className="border-b border-gray-200">
                <button 
                  onClick={() => setTab(tab === item ? '' : item)}
                  className="w-full py-4 flex justify-between items-center text-[#0F2C59] font-bold text-sm uppercase tracking-wide hover:text-[#B78472] transition-colors"
                >
                  {item}
                  <FiChevronDown className={`transform transition-transform ${tab === item ? 'rotate-180' : ''}`} />
                </button>
                {tab === item && item === 'Description' && (
                  <div className="pb-4 text-sm text-gray-600 font-sans leading-relaxed">
                    {product.description}
                  </div>
                )}
                {tab === item && item === 'Materials & Care' && (
                  <div className="pb-4 text-sm text-gray-600 font-sans leading-relaxed">
                    <p>Wipe with a clean, dry cloth when needed. Keep away from water and harsh chemicals. Store in a cool, dry place to prevent tarnishing.</p>
                  </div>
                )}
                {tab === item && item === 'Offers' && (
                  <div className="pb-4 text-sm text-gray-600 font-sans leading-relaxed">
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>Use Code: ELORE10 for 10% off.</li>
                      <li>Flat ₹500 cashback on ICICI Bank Cards.</li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDP;
