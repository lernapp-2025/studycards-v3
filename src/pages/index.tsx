import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Palette, 
  Zap, 
  Heart,
  ArrowRight,
  Check
} from 'lucide-react';

export default function HomePage() {
  const { t } = useTranslation('home');
  const { user } = useAuth();
  const router = useRouter();

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: t('features.cards.title'),
      description: t('features.cards.description'),
      color: 'text-sc-blue',
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: t('features.folders.title'),
      description: t('features.folders.description'),
      color: 'text-sc-green',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t('features.groups.title'),
      description: t('features.groups.description'),
      color: 'text-sc-orange',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: t('features.learning.title'),
      description: t('features.learning.description'),
      color: 'text-sc-purple',
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: t('features.gamification.title'),
      description: t('features.gamification.description'),
      color: 'text-sc-pink',
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: t('features.privacy.title'),
      description: t('features.privacy.description'),
      color: 'text-sc-red',
    },
  ];

  const pricingBenefits = [
    t('pricing.benefits.unlimited'),
    t('pricing.benefits.collaboration'),
    t('pricing.benefits.modes'),
    t('pricing.benefits.statistics'),
    t('pricing.benefits.support'),
    t('pricing.benefits.updates'),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sc-blue to-sc-green rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary">StudyCards</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground">
              {t('nav.features')}
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground">
              {t('nav.pricing')}
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
              {t('nav.privacy')}
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <Button onClick={() => router.push('/dashboard')}>
                {t('nav.dashboard')}
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">{t('nav.signIn')}</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">{t('nav.signUp')}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <div className="text-sm text-muted-foreground">
                {t('hero.trial')}
              </div>
            </div>

            {/* Preview Cards */}
            <div className="relative max-w-md mx-auto">
              <Card className="transform rotate-2 absolute inset-0 bg-sc-blue/20 border-sc-blue/30">
                <CardContent className="p-6">
                  <div className="h-20 flex items-center justify-center text-lg font-semibold">
                    {t('hero.cardExample.front')}
                  </div>
                </CardContent>
              </Card>
              <Card className="transform -rotate-1 relative z-10 bg-sc-green/20 border-sc-green/30">
                <CardContent className="p-6">
                  <div className="h-20 flex items-center justify-center text-lg font-semibold">
                    {t('hero.cardExample.back')}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${feature.color} mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('pricing.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="border-2 border-primary shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-sc-blue to-sc-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{t('pricing.plan.title')}</CardTitle>
                <div className="flex items-baseline justify-center space-x-2">
                  <span className="text-4xl font-bold text-primary">7,99 €</span>
                  <span className="text-muted-foreground">{t('pricing.plan.period')}</span>
                </div>
                <CardDescription className="text-base">
                  {t('pricing.plan.description')}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {pricingBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-sc-green/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-sc-green" />
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
                
                <div className="pt-6">
                  <Button size="lg" className="w-full" asChild>
                    <Link href="/auth/register">
                      {t('pricing.cta')}
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {t('pricing.trial')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-sc-blue to-sc-green rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-primary">StudyCards</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                {t('footer.description')}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-3">{t('footer.links.title')}</h3>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-sm text-muted-foreground hover:text-foreground">
                  {t('footer.links.privacy')}
                </Link>
                <Link href="/terms" className="block text-sm text-muted-foreground hover:text-foreground">
                  {t('footer.links.terms')}
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-3">{t('footer.support.title')}</h3>
              <div className="space-y-2">
                <a href="mailto:support@studycards.com" className="block text-sm text-muted-foreground hover:text-foreground">
                  {t('footer.support.email')}
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 StudyCards. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['home', 'common'])),
  },
});