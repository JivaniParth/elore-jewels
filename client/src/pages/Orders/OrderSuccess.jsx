import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { FiCheckCircle } from 'react-icons/fi';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getById(id)
      .then(res => {
        setOrder(res.data.order || res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching order', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-20 text-center font-sans">Loading your order details...</div>;

  if (!order) return <div className="p-20 text-center font-sans text-red-500">Order not found.</div>;

  return (
    <div className="container mx-auto px-4 py-20 font-sans max-w-3xl text-center">
      <FiCheckCircle className="mx-auto text-6xl text-green-500 mb-6" />
      <h1 className="text-3xl md:text-4xl font-serif text-[#0F2C59] mb-4">Thank you for your order!</h1>
      <p className="text-gray-600 mb-8">Your order <span className="font-bold text-[#B78472]">#{order._id || id}</span> has been placed successfully. We'll send you an email confirmation shortly.</p>

      <div className="bg-gray-50 border border-gray-200 p-6 md:p-10 text-left mb-10 rounded-sm">
        <h3 className="font-serif text-xl text-[#0F2C59] mb-4 border-b pb-4">Order Summary</h3>
        <div className="space-y-4 mb-6">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-400">{item.quantity}x</span>
                <span className="text-sm font-medium text-[#0F2C59] line-clamp-1">{item.name}</span>
              </div>
              <span className="text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.itemsPrice?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{order.shippingPrice?.toFixed(2)}</span>
          </div>
        </div>
        <div className="border-t pt-4 flex justify-between items-center text-lg font-bold text-[#0F2C59]">
          <span>Total</span>
          <span>₹{order.totalPrice?.toFixed(2)}</span>
        </div>
      </div>

      <Link to="/" className="bg-[#0F2C59] hover:bg-[#144272] text-white px-8 py-4 font-bold uppercase tracking-widest text-sm transition-colors rounded-sm shadow-md">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;
