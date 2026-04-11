import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import CONFIG from '@/config';
import { useRouter,usePathname } from "next/navigation";

const stripePromise = loadStripe("pk_test_51QKsR9GTTdOtC6sxIREmlRsNnOLWvueQHerGPwHktFePzWJybb7x5WYWumGntmDdQplODFJm87iobrwhYhU3pfIe008rYIO8nD");

function PaymentForm({ amount, currency }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const pathName = usePathname()
  const router = useRouter()

  const handleRedirect = () => {
    router.push(pathName+`/success`)
    }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const response = await fetch(CONFIG.backendRoute + 'stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency }),
    });
    
    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        setSuccess(true);
        handleRedirect();
      }
    }
    setLoading(false);
  };


  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
      },
    },
  };


  return (
    <div>
      {success ? (
        <div className="text-green-500">Payment successful!</div>
      ) : (
        <form onSubmit={handleSubmit} className="w-[300px] ">
          <h2 className="text-[15px] mb-[10px]">Credit or debit card</h2>
          <CardElement options={cardStyle} className="w-full p-3 border rounded-[10px]" />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={!stripe || loading}
            className={`w-full bg-streamlineBlue text-white mt-[20px] font-bold py-2 px-4 rounded-[12px] ${
              loading && 'opacity-50 cursor-not-allowed'
            }`}
          >
            {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
          </button>
        </form>
      )}
    </div>
  );
}

export default function PaymentPage({ amount, currency }) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm amount={amount*100} currency={currency}/>
    </Elements>
  );
}
