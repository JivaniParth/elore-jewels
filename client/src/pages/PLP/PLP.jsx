import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronDown, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/productSlice';
import { userAPI } from '../../services/api';
import { initAuth } from '../../store/slices/authSlice';

const PLP = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { products, loading, page: currentPage, pages } = useSelector(state => state.product);
  const { addToCart } = useCart();
  
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('-createdAt'); // Default sorting
  const [showSortMenu, setShowSortMenu] = useState(false);

  const categorySlug = location.pathname.split('/').pop();
  
  const title = categorySlug === 'earrings' ? 'Earrings' 
              : categorySlug === 'necklaces' ? 'Necklaces'
              : categorySlug === 'bangles' ? 'Bangles & Bracelets'
              : categorySlug === 'oxidized' ? 'Oxidized Jewelry'
              : categorySlug === 'gold-plated' ? 'Gold Plated'
              : categorySlug === 'silver' ? 'Silver Jewelry'
              : categorySlug === 'mens' ? 'Men\'s Jewelry'
              : 'All Jewelry';

  // Extract real category name for API filtering if needed, or pass slug
  // The backend productAPI.getAll takes params like { category: '...', sort: '...' }
  // Our backend doesn't filter by slug natively unless implemented, but let's assume we pass category name or slug.
  const categoryFilter = categorySlug === 'all' ? undefined : title;

  const loadData = useCallback((pageNum) => {
    dispatch(fetchProducts({ 
      page: pageNum, 
      category: categoryFilter,
      sort 
    }));
  }, [dispatch, categoryFilter, sort]);

  useEffect(() => {
    // Reset when category or sort changes
    setPage(1);
    loadData(1);
  }, [loadData]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage);
  };

  const handleSort = (sortVal) => {
    setSort(sortVal);
    setShowSortMenu(false);
  };

  const handleWishlist = async (e, productId) => {
    e.preventDefault();
    try {
      await userAPI.toggleWishlist(productId);
      dispatch(initAuth()); // Refresh auth to update wishlist array
    } catch (err) {
      console.error(err);
      alert('Please login to add items to your wishlist.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-6 font-sans">
        <Link to="/" className="hover:text-[#B78472]">Home</Link> &gt; 
        <span className="text-gray-800 ml-1">Collections</span> &gt; 
        <span className="text-gray-800 ml-1">{title}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#0F2C59] mb-2">{title}</h1>
          <p className="text-sm text-gray-500 font-sans">{products.length} Products</p>
        </div>
        
        {/* Filters & Sorting */}
        <div className="flex space-x-4 mt-4 md:mt-0 font-sans relative">
          <button className="flex items-center space-x-1 text-sm border border-gray-300 px-4 py-2 hover:border-[#0F2C59]">
            <span>Filter</span>
            <FiChevronDown />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center space-x-1 text-sm border border-gray-300 px-4 py-2 hover:border-[#0F2C59]"
            >
              <span>Sort</span>
              <FiChevronDown />
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg z-20">
                <ul className="py-2 text-sm text-gray-700">
                  <li onClick={() => handleSort('-createdAt')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Newest Arrivals</li>
                  <li onClick={() => handleSort('price')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Price: Low to High</li>
                  <li onClick={() => handleSort('-price')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Price: High to Low</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {products.map(product => (
           <div key={product._id || product.id} className="group cursor-pointer">
             <div className="relative overflow-hidden bg-gray-100 aspect-[4/5] mb-4">
               <Link to={`/product/${product.slug}`}>
                 <img src={product.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={product.name} />
                 {product.images[1] && (
                   <img src={product.images[1]} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" alt={product.name + ' worn'} />
                 )}
               </Link>
               
               {/* Wishlist Icon */}
               <button 
                 onClick={(e) => handleWishlist(e, product._id || product.id)}
                 className="absolute top-2 right-2 p-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:text-red-500 text-gray-400"
               >
                 <FiHeart className="w-4 h-4 md:w-5 md:h-5" />
               </button>

               {/* Quick Add */}
               <div className="absolute bottom-0 left-0 right-0 bg-white/90 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                 <button 
                   onClick={(e) => { e.preventDefault(); addToCart(product); }}
                   className="w-full py-2 text-xs md:text-sm font-bold text-[#0F2C59] hover:text-[#B78472]"
                 >
                   QUICK ADD
                 </button>
               </div>

               {/* Badges */}
               {product.discountPrice > 0 && product.discountPrice < product.price && (
                 <div className="absolute top-2 left-2 bg-[#D4AF37] text-white text-[10px] md:text-xs font-bold px-2 py-1 z-10">
                   SALE
                 </div>
               )}
             </div>
             <div className="text-center">
               <h3 className="font-sans text-sm font-medium text-[#0F2C59] mb-1 truncate px-1">{product.name}</h3>
               <div className="flex items-center justify-center space-x-2">
                 <span className="font-bold text-[#B78472]">₹{(product.discountPrice > 0 ? product.discountPrice : product.price).toFixed(2)}</span>
                 {product.discountPrice > 0 && product.discountPrice < product.price && (
                   <span className="text-xs text-gray-400 line-through">₹{product.price.toFixed(2)}</span>
                 )}
               </div>
             </div>
           </div>
        ))}
        
        {loading && (
          Array(4).fill(0).map((_, i) => (
            <div key={`skel-${i}`} className="animate-pulse">
              <div className="bg-gray-200 aspect-[4/5] mb-4 rounded-sm"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {currentPage < pages && (
        <div className="text-center mt-12">
          <button 
            onClick={handleLoadMore}
            disabled={loading}
            className={`border border-[#0F2C59] px-10 py-3 font-bold uppercase tracking-widest text-sm transition-colors ${loading ? 'opacity-50 text-gray-500 border-gray-300' : 'text-[#0F2C59] hover:bg-[#0F2C59] hover:text-white'}`}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PLP;
