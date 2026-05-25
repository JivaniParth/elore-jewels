import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = ({ onSuccess, isProcessing, setIsProcessing, buttonText }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    // Confirm the payment
    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // We handle redirect manually
    });

    if (submitError) {
      setError(submitError.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent);
    } else {
      setError('An unexpected error occurred.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PaymentElement className="mb-6" />
      {error && <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 border border-red-100">{error}</div>}
      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className={`w-full py-3 font-bold uppercase tracking-widest text-sm transition-colors rounded-sm shadow-md mt-4 ${isProcessing || !stripe ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#D4AF37] hover:bg-[#c4a133] text-white'}`}
      >
        {isProcessing ? 'Processing...' : buttonText || 'Pay Now'}
      </button>
    </form>
  );
};

export default PaymentForm;
