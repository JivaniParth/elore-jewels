import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import PLP from './pages/PLP/PLP';
import PDP from './pages/PDP/PDP';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import CartDrawer from './components/CartDrawer/CartDrawer';

function App() {
  return (
    <Router>
      <Layout>
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/*" element={<PLP />} />
          <Route path="/product/:id" element={<PDP />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
