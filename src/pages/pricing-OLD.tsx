import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
// Removed getStripe import to avoid client-side stripe issues
import toast from 'react-hot-toast';
import { Crown, Check } from 'lucide-react';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();
  const { t } = useTranslation(['common', 'pricing']);
  const router = useRouter();

  const handleUpgrade = async () => {
    if (!session) {
      router.push('/auth/login');
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
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        // Direct redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('Keine Checkout-URL erhalten');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Fehler beim Starten der Zahlung');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sc-blue/5 via-sc-green/5 to-sc-purple/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              StudyCards Premium
            </h1>
            <p className="text-xl text-muted-foreground">
              Upgrade für nur €7.99 - Einmalig, lebenslanger Zugriff
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto mb-12">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="text-center bg-gradient-to-r from-sc-blue/10 to-sc-green/10">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Premium Access</CardTitle>
                <CardDescription>Einmalige Zahlung - Lebenslang gültig</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary mb-2">€7.99</div>
                  <div className="text-sm text-muted-foreground">Einmalig • Keine Abo-Falle</div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Unbegrenzte Karteikarten</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Erweiterte Lernmodi</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Kollaborative Ordner</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Detaillierte Statistiken</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Prioritärer Support</span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full mb-4" 
                  onClick={handleUpgrade}
                  disabled={loading || user?.is_premium}
                >
                  {loading ? (
                    <div className="spinner w-4 h-4 mr-2" />
                  ) : user?.is_premium ? (
                    <Crown className="h-4 w-4 mr-2" />
                  ) : null}
                  
                  {user?.is_premium 
                    ? 'Bereits Premium'
                    : loading 
                    ? 'Wird geladen...'
                    : 'Jetzt upgraden'
                  }
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Sichere Zahlung über Stripe
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'pricing'])),
  },
});