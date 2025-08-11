import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function TestPayment() {
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();

  const startPayment = async () => {
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
          successUrl: window.location.origin + '/dashboard?payment=success',
          cancelUrl: window.location.origin + '/test-payment',
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Checkout-Session konnte nicht erstellt werden');
      }

      // Direkt zu Stripe weiterleiten
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Keine Checkout-URL erhalten');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(`Fehler: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '10px', color: '#1a202c' }}>
          💳 StudyCards Premium
        </h1>
        
        <p style={{ color: '#4a5568', marginBottom: '20px' }}>
          Benutzer: {user?.email || 'Nicht angemeldet'}
        </p>
        
        <div style={{ marginBottom: '30px' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2d3748' }}>
            €7.99
          </div>
          <div style={{ fontSize: '14px', color: '#718096' }}>
            Einmalige Zahlung • Lebenslang gültig
          </div>
        </div>
        
        <button 
          onClick={startPayment}
          disabled={loading || !session}
          style={{
            width: '100%',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: loading || !session ? '#a0aec0' : '#3182ce',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading || !session ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? '⏳ Wird geladen...' : '🚀 Jetzt Premium kaufen'}
        </button>
        
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#a0aec0' }}>
          <p>Sichere Zahlung über Stripe</p>
          <p>Test-Karte: 4242 4242 4242 4242</p>
        </div>
      </div>
    </div>
  );
}