import Header from '../Header/Header';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9] font-sans text-[#0F2C59]">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-[#0F2C59] text-white py-12 text-center mt-12 font-sans">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          <div>
            <h3 className="font-serif text-2xl mb-4 text-[#D4AF37]">Elore Jewels</h3>
            <p className="text-sm text-gray-300">Premium modern ethnic fashion jewelry for every occasion.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Shop</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li><a href="#" className="hover:text-[#D4AF37]">Necklaces</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">Earrings</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">Rings</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Help</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li><a href="#" className="hover:text-[#D4AF37]">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Follow Us</h4>
            <div className="flex space-x-4 text-gray-300">
              <a href="#" className="hover:text-[#D4AF37]">Instagram</a>
              <a href="#" className="hover:text-[#D4AF37]">Facebook</a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-sm text-gray-400 border-t border-gray-700 pt-4">
          &copy; {new Date().getFullYear()} Elore Jewels. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
