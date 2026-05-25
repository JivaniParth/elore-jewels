import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiTrash2 } from 'react-icons/fi';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  
  const freeShippingThreshold = 2000;
  
  // Fake coupon logic
  const discount = couponApplied ? cartTotal * 0.1 : 0;
  const finalTotal = cartTotal - discount;
  const progress = Math.min(100, (finalTotal / freeShippingThreshold) * 100);

  return (
    <div className="container mx-auto px-4 py-12 font-sans">
      <h1 className="text-3xl font-serif text-[#0F2C59] mb-8 text-center">Your Shopping Bag</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 shadow-sm">
          <p className="text-gray-500 mb-6">Your bag is currently empty.</p>
          <Link to="/collections/all" className="bg-[#0F2C59] hover:bg-[#144272] text-white px-8 py-3 font-bold uppercase tracking-widest text-sm transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side (Cart Items) */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white p-6 border border-gray-100 shadow-sm mb-6">
              <div className="flex justify-between border-b pb-4 mb-4 text-sm font-bold text-gray-400 uppercase tracking-wider">
                <span>Product</span>
                <span>Quantity</span>
                <span>Total</span>
              </div>
              
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-6 py-6 border-b border-gray-50 last:border-0">
                  <Link to={`/product/${item.id}`} className="w-24 h-28 flex-shrink-0 bg-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>
                  
                  <div className="flex-1">
                    <Link to={`/product/${item.id}`} className="font-medium text-[#0F2C59] hover:text-[#B78472] line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="text-gray-500 text-sm mt-1">₹{item.price.toFixed(2)}</p>
                    
                    <div className="mt-4 flex items-center space-x-4">
                      <button onClick={() => removeFromCart(item.id)} className="text-sm text-gray-400 hover:text-red-500 flex items-center">
                        <FiTrash2 className="mr-1"/> Remove
                      </button>
                      <button 
                        onClick={() => alert('Moved to Wishlist!')}
                        className="text-sm text-[#B78472] hover:underline"
                      >
                        Move to Wishlist
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center border border-gray-300 h-10">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 hover:bg-gray-100">-</button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 hover:bg-gray-100">+</button>
                  </div>
                  
                  <div className="w-24 text-right font-bold text-[#0F2C59]">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Side (Order Summary) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-[#F9F9F9] p-6 border border-gray-200 sticky top-24">
              <h2 className="font-serif text-xl text-[#0F2C59] border-b pb-4 mb-4">Order Summary</h2>
              
              {/* Free Shipping Progress */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                {progress >= 100 ? (
                  <p className="text-sm font-bold text-green-600 mb-2">🎉 You've unlocked Free Shipping!</p>
                ) : (
                  <p className="text-sm text-gray-600 mb-2">
                    Add <span className="font-bold text-[#B78472]">₹{(freeShippingThreshold - finalTotal).toFixed(2)}</span> more to unlock Free Shipping
                  </p>
                )}
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#D4AF37] h-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between mb-3 text-gray-600">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between mb-3 text-green-600">
                  <span>Discount (10%)</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Estimated Shipping</span>
                <span>{progress >= 100 ? 'FREE' : 'Calculated at checkout'}</span>
              </div>
              
              <div className="border-t pt-4 mb-6 flex justify-between items-center text-lg font-bold text-[#0F2C59]">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
              
              <Link to="/checkout" className="block text-center w-full bg-[#B78472] hover:bg-[#a37260] text-white py-4 font-bold uppercase tracking-widest transition-colors shadow-md text-sm mb-4">
                Proceed to Checkout
              </Link>
              
              <div className="mt-6 border-t pt-4">
                <p className="text-sm font-medium mb-2">Have a coupon code?</p>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    className="flex-1 border border-gray-300 px-3 py-2 text-sm outline-none" 
                  />
                  <button 
                    onClick={() => {
                      if (coupon === 'ELORE10') {
                        setCouponApplied(true);
                      } else {
                        alert('Invalid Coupon Code');
                      }
                    }}
                    className="bg-[#0F2C59] text-white px-4 text-sm hover:bg-[#144272]"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && <p className="text-xs text-green-600 mt-2">Coupon applied successfully!</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
