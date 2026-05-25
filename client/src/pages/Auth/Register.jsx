import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearAuthError } from '../../store/slices/authSlice';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white p-8 border border-gray-200 shadow-sm">
        <h2 className="text-3xl font-serif text-center text-[#0F2C59] mb-6">Create Account</h2>
        
        {error && <div className="bg-red-50 text-red-500 p-3 mb-4 text-sm text-center border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-3 outline-none focus:border-[#0F2C59]"
            />
          </div>
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
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-[#B78472] hover:underline font-bold">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
