import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initAuth } from './store/slices/authSlice';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import PLP from './pages/PLP/PLP';
import PDP from './pages/PDP/PDP';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import CartDrawer from './components/CartDrawer/CartDrawer';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import MyOrders from './pages/Orders/MyOrders';
import OrderSuccess from './pages/Orders/OrderSuccess';
import Wishlist from './pages/Wishlist/Wishlist';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/*" element={<PLP />} />
          <Route path="/product/:slug" element={<PDP />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/orders/:id/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
