import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products.filter(p => p.isBestSeller).slice(0, 4));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-gray-200 overflow-hidden">
        <img 
          src="/hero_banner.png" 
          alt="Elore Jewels - Festive Collection" 
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 drop-shadow-md">Shop the Festive Look</h1>
          <p className="text-white text-lg md:text-xl mb-8 font-sans font-light drop-shadow">Explore our premium bohemian minimalist collection.</p>
          <Link 
            to="/collections/all" 
            className="bg-[#D4AF37] hover:bg-[#B78472] text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-colors shadow-lg"
          >
            Explore Minimalism
          </Link>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="py-12 px-4 container mx-auto">
        <h2 className="text-2xl font-serif text-center mb-8 text-[#0F2C59]">Shop by Category</h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {[
            { name: 'Oxidized', img: '/oxidized_necklace.png' },
            { name: 'Gold Plated', img: '/gold_bangles.png' },
            { name: 'Silver', img: '/silver_earrings.png' },
            { name: 'Men\'s', img: '/mens_ring.png' },
          ].map((cat, i) => (
            <Link key={i} to="/collections/all" className="flex flex-col items-center group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#D4AF37] transition-all p-1">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="mt-3 font-sans text-sm md:text-base font-medium text-[#144272] group-hover:text-[#D4AF37] transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Best Sellers Grid Preview */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-serif text-center mb-10 text-[#0F2C59]">Trending Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loading ? (
              // Skeleton Loaders
              [1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[4/5] mb-4 rounded-sm"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))
            ) : (
              products.map(product => (
                 <div key={product.id} className="group cursor-pointer">
                   <div className="relative overflow-hidden bg-gray-100 aspect-[4/5] mb-4">
                     <Link to={`/product/${product.id}`}>
                       <img src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={product.name} />
                       <img src={product.hoverImage} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" alt={product.name + ' worn'} />
                     </Link>
                     <div className="absolute top-2 right-2 p-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:text-red-500 text-gray-400">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                     </div>
                     <div className="absolute bottom-0 left-0 right-0 bg-white/90 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                       <button 
                         onClick={(e) => { e.preventDefault(); addToCart(product); }}
                         className="w-full py-2 text-sm font-bold text-[#0F2C59] hover:text-[#B78472]"
                       >
                         QUICK ADD
                       </button>
                     </div>
                     {product.discount > 0 && (
                       <div className="absolute top-2 left-2 bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 z-10">
                         {product.discount}% OFF
                       </div>
                     )}
                   </div>
                   <h3 className="font-sans text-sm font-medium text-[#0F2C59] mb-1 truncate">{product.name}</h3>
                   <div className="flex items-center space-x-2">
                     <span className="font-bold text-[#B78472]">${product.price.toFixed(2)}</span>
                     {product.originalPrice > product.price && (
                       <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                     )}
                   </div>
                 </div>
              ))
            )}
          </div>
          <div className="text-center mt-10">
            <Link to="/collections/all" className="inline-block border border-[#0F2C59] text-[#0F2C59] hover:bg-[#0F2C59] hover:text-white px-8 py-2 font-medium transition-colors">
              View All
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
