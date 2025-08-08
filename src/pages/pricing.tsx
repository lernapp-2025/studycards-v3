import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { getStripe } from '@/lib/stripe';
import { 
  Crown, 
  Check, 
  Zap, 
  Users, 
  BookOpen, 
  BarChart3,
  Shield,
  Headphones,
  ArrowLeft
} from 'lucide-react';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();
  const { t } = useTranslation(['pricing', 'common']);
  const router = useRouter();

  const handleUpgrade = async () => {
    if (!user || !session) {
      router.push('/auth/login?redirect=pricing');
      return;
    }

    if (user.is_premium) {
      toast.success(t('pricing:alreadyPremium'));
      router.push('/dashboard');
      return;
    }

    setLoading(true);

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { sessionId, url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        // Fallback: redirect to Stripe Checkout using Stripe.js
        const stripe = await getStripe();
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            throw new Error(error.message);
          }
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || t('pricing:checkoutError'));
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: t('pricing:features.unlimited.title'),
      description: t('pricing:features.unlimited.description'),
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: t('pricing:features.collaboration.title'),
      description: t('pricing:features.collaboration.description'),
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: t('pricing:features.modes.title'),
      description: t('pricing:features.modes.description'),
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: t('pricing:features.analytics.title'),
      description: t('pricing:features.analytics.description'),
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: t('pricing:features.privacy.title'),
      description: t('pricing:features.privacy.description'),
    },
    {
      icon: <Headphones className="h-5 w-5" />,
      title: t('pricing:features.support.title'),
      description: t('pricing:features.support.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sc-blue to-sc-green rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary">StudyCards</span>
          </Link>
          
          {user ? (
            <Button onClick={() => router.push('/dashboard')}>
              {t('common:nav.dashboard')}
            </Button>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">{t('common:nav.signIn')}</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">{t('common:nav.signUp')}</Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-sc-orange to-sc-red rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('pricing:title')}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              {t('pricing:subtitle')}
            </p>

            {user && !user.is_premium && (
              <div className="bg-sc-orange/10 border border-sc-orange/20 rounded-lg p-4 max-w-md mx-auto mb-8">
                <div className="text-sm text-sc-orange font-medium">
                  {t('pricing:trialStatus')}
                </div>
              </div>
            )}

            {user?.is_premium && (
              <div className="bg-sc-green/10 border border-sc-green/20 rounded-lg p-4 max-w-md mx-auto mb-8">
                <div className="flex items-center justify-center space-x-2">
                  <Crown className="h-5 w-5 text-sc-green" />
                  <div className="text-sm text-sc-green font-medium">
                    {t('pricing:alreadyPremium')}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto mb-12">
            <Card className="border-2 border-primary shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-sc-blue to-sc-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                
                <CardTitle className="text-2xl">{t('pricing:plan.title')}</CardTitle>
                
                <div className="flex items-baseline justify-center space-x-2 my-4">
                  <span className="text-5xl font-bold text-primary">7,99 €</span>
                  <span className="text-muted-foreground">{t('pricing:plan.period')}</span>
                </div>
                
                <CardDescription className="text-base">
                  {t('pricing:plan.description')}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
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
                    ? t('pricing:alreadyOwned')
                    : loading 
                    ? t('pricing:processing')
                    : t('pricing:upgradeButton')
                  }
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {t('pricing:securePayment')}
                  </p>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <div className="text-xs text-muted-foreground">Powered by</div>
                    <div className="font-semibold text-xs">Stripe</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features List */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">
              {t('pricing:featuresTitle')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-sc-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-sc-green">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="border-t pt-12">
            <h2 className="text-2xl font-bold text-center mb-8">
              {t('pricing:faq.title')}
            </h2>
            
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t('pricing:faq.q1.question')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('pricing:faq.q1.answer')}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t('pricing:faq.q2.question')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('pricing:faq.q2.answer')}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t('pricing:faq.q3.question')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('pricing:faq.q3.answer')}
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('pricing:backToHome')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['pricing', 'common'])),
  },
});