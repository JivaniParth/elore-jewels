import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Checkout = () => {
  const { cartItems, cartTotal } = useCart();
  const [step, setStep] = useState(1); // 1: Info, 2: Shipping, 3: Payment

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center font-sans">
        <h1 className="text-2xl font-serif text-[#0F2C59] mb-4">Your Cart is Empty</h1>
        <Link to="/" className="text-[#B78472] hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 font-sans max-w-6xl flex flex-col md:flex-row gap-12">
      {/* Left Column - Steps */}
      <div className="w-full md:w-3/5">
        <div className="flex items-center justify-between mb-8 text-sm font-medium text-gray-400">
          <span className={`cursor-pointer ${step >= 1 ? 'text-[#0F2C59]' : ''}`} onClick={() => setStep(1)}>Information</span>
          <span className="flex-1 border-t mx-4"></span>
          <span className={`cursor-pointer ${step >= 2 ? 'text-[#0F2C59]' : ''}`} onClick={() => step >= 2 && setStep(2)}>Shipping</span>
          <span className="flex-1 border-t mx-4"></span>
          <span className={`cursor-pointer ${step >= 3 ? 'text-[#0F2C59]' : ''}`} onClick={() => step >= 3 && setStep(3)}>Payment</span>
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-serif text-[#0F2C59] mb-4">Contact Information</h2>
            <input type="email" placeholder="Email or mobile phone number" className="w-full border border-gray-300 p-3 mb-6 rounded-sm outline-none focus:border-[#0F2C59]" />
            
            <h2 className="text-xl font-serif text-[#0F2C59] mb-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="First name" className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#0F2C59]" />
              <input type="text" placeholder="Last name" className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#0F2C59]" />
            </div>
            <input type="text" placeholder="Address" className="w-full border border-gray-300 p-3 mb-4 rounded-sm outline-none focus:border-[#0F2C59]" />
            <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full border border-gray-300 p-3 mb-4 rounded-sm outline-none focus:border-[#0F2C59]" />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <input type="text" placeholder="City" className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#0F2C59]" />
              <input type="text" placeholder="State" className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#0F2C59]" />
              <input type="text" placeholder="ZIP code" className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#0F2C59]" />
            </div>
            
            <div className="flex justify-between items-center mt-8">
              <Link to="/cart" className="text-[#B78472] hover:underline text-sm">&lt; Return to cart</Link>
              <button onClick={() => setStep(2)} className="bg-[#0F2C59] hover:bg-[#144272] text-white px-8 py-3 font-bold uppercase tracking-widest text-sm transition-colors rounded-sm">
                Continue to shipping
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="border border-gray-200 rounded-sm mb-8">
              <div className="flex justify-between p-4 border-b">
                <span className="text-gray-500 w-24">Contact</span>
                <span className="flex-1">user@example.com</span>
                <button onClick={() => setStep(1)} className="text-[#B78472] text-sm hover:underline">Change</button>
              </div>
              <div className="flex justify-between p-4">
                <span className="text-gray-500 w-24">Ship to</span>
                <span className="flex-1">123 Jewelry Lane, NY 10001</span>
                <button onClick={() => setStep(1)} className="text-[#B78472] text-sm hover:underline">Change</button>
              </div>
            </div>

            <h2 className="text-xl font-serif text-[#0F2C59] mb-4">Shipping Method</h2>
            <div className="border border-gray-200 rounded-sm">
              <label className="flex justify-between p-4 items-center cursor-pointer hover:bg-gray-50">
                <div className="flex items-center">
                  <input type="radio" name="shipping" className="mr-4 accent-[#0F2C59]" defaultChecked />
                  <span>Standard Shipping (5-7 business days)</span>
                </div>
                <span className="font-bold">Free</span>
              </label>
              <label className="flex justify-between p-4 items-center border-t cursor-pointer hover:bg-gray-50">
                <div className="flex items-center">
                  <input type="radio" name="shipping" className="mr-4 accent-[#0F2C59]" />
                  <span>Express Shipping (2-3 business days)</span>
                </div>
                <span className="font-bold">$15.00</span>
              </label>
            </div>

            <div className="flex justify-between items-center mt-8">
              <button onClick={() => setStep(1)} className="text-[#B78472] hover:underline text-sm">&lt; Return to information</button>
              <button onClick={() => setStep(3)} className="bg-[#0F2C59] hover:bg-[#144272] text-white px-8 py-3 font-bold uppercase tracking-widest text-sm transition-colors rounded-sm">
                Continue to payment
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
             <h2 className="text-xl font-serif text-[#0F2C59] mb-4">Payment</h2>
             <p className="text-sm text-gray-500 mb-6">All transactions are secure and encrypted.</p>

             <div className="border border-gray-200 rounded-sm mb-8">
               <label className="flex p-4 items-center cursor-pointer border-b hover:bg-gray-50 bg-gray-50">
                 <input type="radio" name="payment" className="mr-4 accent-[#0F2C59]" defaultChecked />
                 <span className="font-medium">Credit Card</span>
               </label>
               <div className="p-4 bg-white grid gap-4">
                 <input type="text" placeholder="Card number" className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#0F2C59]" />
                 <div className="grid grid-cols-2 gap-4">
                   <input type="text" placeholder="Expiration date (MM/YY)" className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#0F2C59]" />
                   <input type="text" placeholder="Security code" className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#0F2C59]" />
                 </div>
               </div>
               
               <label className="flex p-4 items-center cursor-pointer border-y hover:bg-gray-50">
                 <input type="radio" name="payment" className="mr-4 accent-[#0F2C59]" />
                 <span className="font-medium">UPI / Net Banking</span>
               </label>

               <label className="flex p-4 items-center cursor-pointer hover:bg-gray-50">
                 <input type="radio" name="payment" className="mr-4 accent-[#0F2C59]" />
                 <span className="font-medium">Cash on Delivery</span>
               </label>
             </div>

             <div className="flex justify-between items-center mt-8">
              <button onClick={() => setStep(2)} className="text-[#B78472] hover:underline text-sm">&lt; Return to shipping</button>
              <button onClick={() => alert('Order Placed Successfully!')} className="bg-[#D4AF37] hover:bg-[#c4a133] text-white px-8 py-3 font-bold uppercase tracking-widest text-sm transition-colors rounded-sm shadow-md">
                Pay Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Order Summary */}
      <div className="w-full md:w-2/5 bg-gray-50 p-6 border-l border-gray-200 h-fit">
        <h3 className="font-serif text-lg mb-4 text-[#0F2C59]">Order Summary</h3>
        <div className="space-y-4 mb-6">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative w-16 h-16 bg-white border rounded overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-10">{item.quantity}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#0F2C59] line-clamp-1">{item.name}</p>
              </div>
              <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
        </div>

        <div className="border-t mt-4 pt-4 flex justify-between items-center text-lg font-bold text-[#0F2C59]">
          <span>Total</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
