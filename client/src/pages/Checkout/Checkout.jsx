import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useDispatch, useSelector } from 'react-redux';
import { orderAPI } from '../../services/api';
import { placeOrder } from '../../store/slices/orderSlice';
import StripeWrapper from '../../components/StripeWrapper';
import PaymentForm from '../../components/PaymentForm';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  
  const [info, setInfo] = useState({ 
    email: '', firstName: '', lastName: '', address: '', city: '', state: '', zip: '' 
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [clientSecret, setClientSecret] = useState('');

  // Prefill user data
  useEffect(() => {
    if (user && isAuthenticated) {
      setInfo(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.name ? user.name.split(' ')[0] : '',
        lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
        address: user.addresses?.[0]?.street || '',
        city: user.addresses?.[0]?.city || '',
        state: user.addresses?.[0]?.state || '',
        zip: user.addresses?.[0]?.zipCode || ''
      }));
    }
  }, [user, isAuthenticated]);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center font-sans">
        <h1 className="text-2xl font-serif text-[#0F2C59] mb-4">Your Cart is Empty</h1>
        <Link to="/" className="text-[#B78472] hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const shippingCost = shippingMethod === 'express' ? 150 : 0;
  const finalTotal = cartTotal + shippingCost;

  // Prepare Stripe Intent when reaching Step 3
  const handleProceedToPayment = async () => {
    setStep(3);
    if (paymentMethod === 'card' && !clientSecret) {
      try {
        const res = await orderAPI.stripeIntent(finalTotal);
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error("Failed to create stripe intent", err);
      }
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const orderData = {
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: item.id || item._id
        })),
        shippingAddress: {
          line1: info.address,
          city: info.city,
          pincode: info.zip,
          country: 'India'
        },
        paymentMethod: paymentMethod === 'card' ? 'Stripe' : 'COD',
        paymentStatus: paymentMethod === 'card' ? 'Completed' : 'Pending',
        stripePaymentId: paymentIntent?.id,
        itemsPrice: cartTotal,
        shippingPrice: shippingCost,
        totalPrice: finalTotal
      };
      
      const result = await dispatch(placeOrder(orderData)).unwrap();
      clearCart();
      navigate(`/orders/${result._id}/success`);
    } catch (err) {
      alert(err || "Error placing order");
      setLoading(false);
    }
  };

  const handlePay = () => {
    if (paymentMethod === 'cod') {
      setLoading(true);
      handlePaymentSuccess(null);
    }
  };

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
            <input 
              type="email" placeholder="Email" 
              value={info.email} onChange={(e)=>setInfo({...info, email: e.target.value})}
              className="w-full border border-gray-300 p-3 mb-6 rounded-sm outline-none focus:border-[#0F2C59]" 
            />
            
            <h2 className="text-xl font-serif text-[#0F2C59] mb-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="First name" value={info.firstName} onChange={(e)=>setInfo({...info, firstName: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#0F2C59]" />
              <input type="text" placeholder="Last name" value={info.lastName} onChange={(e)=>setInfo({...info, lastName: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#0F2C59]" />
            </div>
            <input type="text" placeholder="Address" value={info.address} onChange={(e)=>setInfo({...info, address: e.target.value})} className="w-full border border-gray-300 p-3 mb-4 rounded-sm outline-none focus:border-[#0F2C59]" />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <input type="text" placeholder="City" value={info.city} onChange={(e)=>setInfo({...info, city: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#0F2C59]" />
              <input type="text" placeholder="State" value={info.state} onChange={(e)=>setInfo({...info, state: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#0F2C59]" />
              <input type="text" placeholder="PIN code" value={info.zip} onChange={(e)=>setInfo({...info, zip: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#0F2C59]" />
            </div>
            
            <div className="flex justify-between items-center mt-8">
              <Link to="/cart" className="text-[#B78472] hover:underline text-sm">&lt; Return to cart</Link>
              <button 
                onClick={() => {
                  if(info.email && info.address && info.city) setStep(2);
                  else alert('Please fill required fields (Email, Address, City)');
                }} 
                className="bg-[#0F2C59] hover:bg-[#144272] text-white px-8 py-3 font-bold uppercase tracking-widest text-sm transition-colors rounded-sm"
              >
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
                <span className="flex-1">{info.email}</span>
                <button onClick={() => setStep(1)} className="text-[#B78472] text-sm hover:underline">Change</button>
              </div>
              <div className="flex justify-between p-4">
                <span className="text-gray-500 w-24">Ship to</span>
                <span className="flex-1">{info.address}, {info.city} {info.zip}</span>
                <button onClick={() => setStep(1)} className="text-[#B78472] text-sm hover:underline">Change</button>
              </div>
            </div>

            <h2 className="text-xl font-serif text-[#0F2C59] mb-4">Shipping Method</h2>
            <div className="border border-gray-200 rounded-sm">
              <label className="flex justify-between p-4 items-center cursor-pointer hover:bg-gray-50 border-b">
                <div className="flex items-center">
                  <input type="radio" name="shipping" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="mr-4 accent-[#0F2C59]" />
                  <span>Standard Shipping (5-7 business days)</span>
                </div>
                <span className="font-bold">Free</span>
              </label>
              <label className="flex justify-between p-4 items-center cursor-pointer hover:bg-gray-50">
                <div className="flex items-center">
                  <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="mr-4 accent-[#0F2C59]" />
                  <span>Express Shipping (2-3 business days)</span>
                </div>
                <span className="font-bold">₹150.00</span>
              </label>
            </div>

            <div className="flex justify-between items-center mt-8">
              <button onClick={() => setStep(1)} className="text-[#B78472] hover:underline text-sm">&lt; Return to information</button>
              <button onClick={handleProceedToPayment} className="bg-[#0F2C59] hover:bg-[#144272] text-white px-8 py-3 font-bold uppercase tracking-widest text-sm transition-colors rounded-sm">
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
                 <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => {
                   setPaymentMethod('card');
                   handleProceedToPayment(); // Re-trigger intent fetch if missing
                 }} className="mr-4 accent-[#0F2C59]" />
                 <span className="font-medium">Credit / Debit Card</span>
               </label>
               {paymentMethod === 'card' && (
                 <div className="p-6 bg-white">
                   <StripeWrapper clientSecret={clientSecret}>
                     <PaymentForm 
                        onSuccess={handlePaymentSuccess} 
                        isProcessing={loading} 
                        setIsProcessing={setLoading} 
                        buttonText={`Pay ₹${finalTotal.toFixed(2)}`}
                     />
                   </StripeWrapper>
                 </div>
               )}

               <label className="flex p-4 items-center cursor-pointer hover:bg-gray-50">
                 <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mr-4 accent-[#0F2C59]" />
                 <span className="font-medium">Cash on Delivery</span>
               </label>
             </div>

             <div className="flex justify-between items-center mt-8">
              <button onClick={() => setStep(2)} className="text-[#B78472] hover:underline text-sm">&lt; Return to shipping</button>
              {paymentMethod === 'cod' && (
                <button 
                  onClick={handlePay} 
                  disabled={loading}
                  className={`px-8 py-3 font-bold uppercase tracking-widest text-sm transition-colors rounded-sm shadow-md ${loading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#D4AF37] hover:bg-[#c4a133] text-white'}`}
                >
                  {loading ? 'Processing...' : `Place Order (₹${finalTotal.toFixed(2)})`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Order Summary */}
      <div className="w-full md:w-2/5 bg-gray-50 p-6 border-l border-gray-200 h-fit sticky top-24">
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
              <p className="text-sm font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
          </div>
        </div>

        <div className="border-t mt-4 pt-4 flex justify-between items-center text-lg font-bold text-[#0F2C59]">
          <span>Total</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
