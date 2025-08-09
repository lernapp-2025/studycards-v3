import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function PaymentTest() {
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();

  const handlePayment = async () => {
    if (!session) {
      toast.error('Bitte zuerst anmelden');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/dashboard?payment=success`,
          cancelUrl: `${window.location.origin}/payment-test`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(`Fehler: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>💳 Stripe Payment Test</h1>
      <p>User: {user?.email || 'Nicht angemeldet'}</p>
      <p>Premium: {user?.is_premium ? 'Ja' : 'Nein'}</p>
      
      <div style={{ margin: '30px 0' }}>
        <h2>€7.99 StudyCards Premium</h2>
        <button 
          onClick={handlePayment}
          disabled={loading || !session}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: loading ? '#ccc' : '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Laden...' : '💸 €7.99 Zahlen (Test)'}
        </button>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Test-Karte: 4242 4242 4242 4242</p>
        <p>Datum: 12/34, CVC: 123</p>
      </div>
    </div>
  );
}