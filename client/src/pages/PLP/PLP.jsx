import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronDown, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const PLP = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  const { addToCart } = useCart();

  const title = location.pathname.includes('earrings') ? 'Earrings' 
              : location.pathname.includes('necklaces') ? 'Necklaces'
              : location.pathname.includes('bangles') ? 'Bangles & Bracelets'
              : location.pathname.includes('oxidized') ? 'Oxidized Jewelry'
              : location.pathname.includes('gold-plated') ? 'Gold Plated'
              : location.pathname.includes('silver') ? 'Silver Jewelry'
              : location.pathname.includes('mens') ? 'Men\'s Jewelry'
              : 'All Jewelry';

  const fetchProducts = useCallback((pageToFetch) => {
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      fetch('/data.json')
        .then(res => res.json())
        .then(data => {
          // Pagination simulation: 8 items per page
          const ITEMS_PER_PAGE = 8;
          const startIndex = (pageToFetch - 1) * ITEMS_PER_PAGE;
          const endIndex = startIndex + ITEMS_PER_PAGE;
          
          let filteredProducts = data.products;
          // Basic client-side filtering based on URL path for demo purposes
          if (location.pathname.includes('earrings')) filteredProducts = filteredProducts.filter(p => p.category === 'Earrings');
          else if (location.pathname.includes('necklaces')) filteredProducts = filteredProducts.filter(p => p.category === 'Necklaces');
          else if (location.pathname.includes('bangles')) filteredProducts = filteredProducts.filter(p => p.category === 'Bangles');
          
          const newProducts = filteredProducts.slice(startIndex, endIndex);
          
          if (pageToFetch === 1) {
            setProducts(newProducts);
          } else {
            setProducts(prev => [...prev, ...newProducts]);
          }
          
          if (endIndex >= filteredProducts.length) {
            setHasMore(false);
          }
          setLoading(false);
        });
    }, 800);
  }, [location.pathname]);

  useEffect(() => {
    // Reset when category changes
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1);
  }, [fetchProducts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs & Title */}
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2 font-sans">
          <Link to="/" className="hover:text-[#B78472]">Home</Link> &gt; <span>{title}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-[#0F2C59]">{title}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar (Filters) */}
        <div className="w-full md:w-1/4">
          <div className="bg-white p-4 border border-gray-200">
            <h2 className="font-bold font-sans text-lg border-b pb-2 mb-4 text-[#0F2C59]">Filters</h2>
            
            {/* Filter Accordion Items */}
            {['Category', 'Price Range', 'Material', 'Occasion'].map((filter, index) => (
              <div key={index} className="mb-4 border-b border-gray-100 pb-4">
                <button className="flex justify-between items-center w-full text-left font-medium text-[#144272] hover:text-[#B78472]">
                  {filter}
                  <FiChevronDown />
                </button>
                {/* Simulated open state for first item */}
                {index === 0 && (
                  <div className="mt-3 flex flex-col space-y-2 text-sm text-gray-600">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="accent-[#B78472]" /> <span>Necklaces</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="accent-[#B78472]" /> <span>Earrings</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="accent-[#B78472]" /> <span>Bangles</span>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Grid (Products) */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500 font-sans">{products.length} products found</span>
            <select className="border border-gray-300 p-2 text-sm font-sans outline-none bg-white">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>New Arrivals</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
               <div key={product.id} className="group cursor-pointer">
                 <div className="relative overflow-hidden bg-gray-100 aspect-[4/5] mb-3">
                   <Link to={`/product/${product.id}`}>
                     <img src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={product.name} />
                     <img src={product.hoverImage} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" alt={product.name + ' hover'} />
                   </Link>
                   
                   <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:text-red-500 text-gray-400 shadow-sm">
                     <FiHeart size={18} />
                   </button>

                   <div className="absolute bottom-0 left-0 right-0 bg-white/90 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                     <button 
                       onClick={(e) => { e.preventDefault(); addToCart(product); }}
                       className="w-full py-2 text-sm font-bold text-[#0F2C59] hover:text-[#B78472]"
                     >
                       QUICK ADD
                     </button>
                   </div>

                   {product.discount > 0 && (
                     <div className="absolute top-2 left-2 bg-[#D4AF37] text-white text-[10px] font-bold px-2 py-1 z-10 tracking-wider">
                       {product.discount}% OFF
                     </div>
                   )}
                 </div>
                 
                 <div className="text-center">
                   <h3 className="font-sans text-sm font-medium text-[#0F2C59] mb-1 truncate px-1">{product.name}</h3>
                   <div className="flex items-center justify-center space-x-2">
                     <span className="font-bold text-[#B78472]">₹{product.price.toFixed(2)}</span>
                     {product.originalPrice > product.price && (
                       <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toFixed(2)}</span>
                     )}
                   </div>
                   <div className="text-[10px] text-yellow-500 mt-1">
                     ★ {product.rating} ({product.reviews})
                   </div>
                 </div>
               </div>
            ))}
            
            {loading && [1, 2, 3, 4].map(i => (
              <div key={`skel-${i}`} className="animate-pulse">
                <div className="bg-gray-200 aspect-[4/5] mb-3"></div>
                <div className="h-4 bg-gray-200 w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>

          {hasMore && !loading && (
            <div className="text-center mt-12">
              <button 
                onClick={handleLoadMore}
                className="border-2 border-[#0F2C59] text-[#0F2C59] hover:bg-[#0F2C59] hover:text-white px-10 py-3 font-bold uppercase tracking-widest text-sm transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PLP;
