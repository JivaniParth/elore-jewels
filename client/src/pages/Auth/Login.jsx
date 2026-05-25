import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser, clearAuthError } from '../../store/slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, from, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white p-8 border border-gray-200 shadow-sm">
        <h2 className="text-3xl font-serif text-center text-[#0F2C59] mb-6">Login</h2>
        
        {error && <div className="bg-red-50 text-red-500 p-3 mb-4 text-sm text-center border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 outline-none focus:border-[#0F2C59]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 outline-none focus:border-[#0F2C59]"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 font-bold uppercase tracking-widest text-sm transition-colors mt-4 ${loading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#0F2C59] hover:bg-[#144272] text-white shadow-md'}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-[#B78472] hover:underline font-bold">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
