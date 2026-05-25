import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../store/slices/orderSlice';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) return <div className="p-20 text-center font-sans">Loading orders...</div>;
  if (error) return <div className="p-20 text-center font-sans text-red-500">Error loading orders: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-12 font-sans max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-serif text-[#0F2C59] mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center bg-gray-50 p-12 border border-gray-200">
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link to="/" className="text-[#B78472] hover:underline font-bold">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="border border-gray-200 rounded-sm overflow-hidden bg-white">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Placed</p>
                  <p className="text-sm font-bold text-[#0F2C59]">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
                  <p className="text-sm font-bold text-[#0F2C59]">₹{order.totalPrice?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order #</p>
                  <p className="text-sm text-gray-800">{order._id}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6 py-4 border-b last:border-0 border-gray-100">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover border border-gray-200" />
                    <div className="flex-1">
                      <Link to={`/product/${item.product}`} className="font-bold text-[#0F2C59] hover:text-[#B78472] line-clamp-1">{item.name}</Link>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
