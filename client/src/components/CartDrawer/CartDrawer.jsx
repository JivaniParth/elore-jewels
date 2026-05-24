import { useCart } from '../../context/CartContext';
import { FiX, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { isDrawerOpen, setIsDrawerOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity" 
        onClick={() => setIsDrawerOpen(false)}
      ></div>
      
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-[70] shadow-xl flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#F9F9F9]">
          <h2 className="text-lg font-serif text-[#0F2C59]">Shopping Bag ({cartItems.length})</h2>
          <button onClick={() => setIsDrawerOpen(false)} className="text-gray-500 hover:text-red-500">
            <FiX size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-20 font-sans">
              <p className="mb-4">Your bag is empty.</p>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="bg-[#0F2C59] text-white px-6 py-2 uppercase text-sm font-bold tracking-wider hover:bg-[#144272]"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                  <div className="w-20 h-24 bg-gray-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-sans text-sm font-medium text-[#0F2C59] line-clamp-2 pr-4">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      <p className="font-bold text-[#B78472] mt-1">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center border border-gray-300 w-fit">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >-</button>
                      <span className="px-2 text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 bg-[#F9F9F9]">
            <div className="flex justify-between items-center mb-4 text-[#0F2C59] font-bold text-lg">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4 text-center">Shipping & taxes calculated at checkout</p>
            <Link 
              to="/checkout" 
              onClick={() => setIsDrawerOpen(false)}
              className="block w-full text-center bg-[#B78472] hover:bg-[#a37260] text-white py-3 font-bold uppercase tracking-widest transition-colors shadow-md text-sm"
            >
              Checkout Now
            </Link>
            <Link 
              to="/cart"
              onClick={() => setIsDrawerOpen(false)}
              className="block w-full text-center text-[#0F2C59] mt-3 underline text-sm hover:text-[#B78472]"
            >
              View Cart Page
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
