import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiShare2, FiTruck, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const PDP = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [pincode, setPincode] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        const found = data.products.find(p => p.id === id) || data.products[0];
        setProduct(found);
        setMainImage(found.image);
        setLoading(false);
      });
  }, [id]);

  if (loading || !product) {
    return <div className="p-20 text-center font-sans">Loading product...</div>;
  }

  const images = [product.image, product.hoverImage, product.image, product.hoverImage];

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
        <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-2 md:w-20 overflow-x-auto md:overflow-visible">
            {images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`${product.name} view ${idx}`} 
                onClick={() => setMainImage(img)}
                className={`w-16 h-20 md:w-20 md:h-24 object-cover cursor-pointer border-2 ${mainImage === img ? 'border-[#D4AF37]' : 'border-transparent'} hover:border-[#B78472] transition-colors`}
              />
            ))}
          </div>
          <div className="flex-1 relative bg-gray-100 aspect-[4/5] overflow-hidden">
            <img src={mainImage} className="w-full h-full object-cover" alt={product.name} />
            <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:text-red-500 transition-colors">
              <FiHeart size={20} />
            </button>
            <button className="absolute top-16 right-4 bg-white p-2 rounded-full shadow hover:text-[#B78472] transition-colors">
              <FiShare2 size={20} />
            </button>
          </div>
        </div>

        {/* Right Side (Product Info) */}
        <div className="w-full md:w-1/2">
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h1 className="text-3xl font-serif text-[#0F2C59] mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 font-sans text-sm">
              <div className="flex items-center text-yellow-500">
                <span className="mr-1">★ {product.rating}</span>
                <span className="text-gray-400">({product.reviews} Reviews)</span>
              </div>
              <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded font-medium">In Stock</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline space-x-3 mb-1">
              <span className="text-3xl font-bold text-[#B78472]">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              {product.discount > 0 && (
                <span className="text-sm font-bold text-[#D4AF37]">({product.discount}% OFF)</span>
              )}
            </div>
            <p className="text-xs text-gray-500">Inclusive of all taxes</p>
          </div>

          {/* Urgency Trigger */}
          <div className="bg-red-50 text-red-700 text-sm py-2 px-4 rounded mb-6 flex items-center">
            <span className="animate-pulse mr-2 h-2 w-2 bg-red-600 rounded-full"></span>
            Only 3 left in stock! 12 people bought this in the last 24 hours.
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-3 mb-8">
            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-[#B78472] hover:bg-[#a37260] text-white py-4 font-bold uppercase tracking-widest transition-colors shadow-md text-sm"
            >
              Add to Bag
            </button>
            <button className="w-full bg-[#0F2C59] hover:bg-[#144272] text-white py-4 font-bold uppercase tracking-widest transition-colors shadow-md text-sm">
              Buy it Now
            </button>
          </div>

          {/* Pincode Validator */}
          <div className="bg-[#F9F9F9] p-4 rounded mb-6 border border-gray-200">
            <div className="flex items-center mb-2 text-[#0F2C59] font-medium">
              <FiTruck className="mr-2" /> Check Delivery Date
            </div>
            <div className="flex">
              <input 
                type="text" 
                placeholder="Enter Pincode" 
                className="flex-1 border border-gray-300 px-3 py-2 text-sm outline-none"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button className="bg-gray-800 text-white px-4 text-sm font-medium hover:bg-black">CHECK</button>
            </div>
          </div>

          {/* Accordions */}
          <div className="border-t border-gray-200">
            {['Offers', 'Description', 'Material & Care', 'Shipping & Returns'].map((tab, idx) => (
              <div key={idx} className="border-b border-gray-200">
                <button className="w-full py-4 flex justify-between items-center text-left font-medium text-[#0F2C59] hover:text-[#B78472]">
                  {tab}
                  <FiChevronDown />
                </button>
                {/* Simulated open state for Description */}
                {tab === 'Description' && (
                  <div className="pb-4 text-sm text-gray-600 font-sans leading-relaxed">
                    Elevate your ethnic ensemble with this meticulously crafted {product.name}. 
                    Designed to blend traditional aesthetics with contemporary minimalism, this piece 
                    features intricate detailing and a premium finish. Perfect for festive occasions 
                    or adding a statement to your everyday wear.
                  </div>
                )}
                {tab === 'Offers' && (
                  <div className="pb-4 text-sm text-gray-600 font-sans leading-relaxed">
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Use code <strong>ELORE10</strong> for 10% off.</li>
                      <li>Flat $50 cashback on ICICI Bank Cards.</li>
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
