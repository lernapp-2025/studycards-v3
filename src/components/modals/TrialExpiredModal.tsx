import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Crown, X } from 'lucide-react';

export default function TrialExpiredModal() {
  const { user, isTrialExpired, isPremium } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const { t, ready } = useTranslation('common');
  const router = useRouter();

  // Debug logging
  console.log('TrialExpiredModal Debug:', {
    ready,
    sampleTranslation: t('trialExpired.title'),
    isTranslationKey: t('trialExpired.title') === 'trialExpired.title'
  });

  // Fallback text for when translations aren't loaded
  const getText = (key: string, fallback: string) => {
    const translated = t(key);
    console.log(`Translation for ${key}:`, translated);
    
    if (!ready || !translated || translated === key) {
      console.log(`Using fallback for ${key}:`, fallback);
      return fallback;
    }
    return translated;
  };

  if (!user || isPremium || !isTrialExpired || !isVisible) {
    return null;
  }

  const handleUpgrade = () => {
    router.push('/pricing');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-2 border-sc-orange">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-sc-orange to-sc-red rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-sc-orange">
            {getText('trialExpired.title', 'Dein kostenloser Testzeitraum ist abgelaufen')}
          </CardTitle>
          <CardDescription className="text-base">
            {getText('trialExpired.subtitle', 'Schalte StudyCards jetzt dauerhaft frei')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {getText('trialExpired.message', 'Um weiterhin alle Funktionen von StudyCards nutzen zu können, schalte dein Konto jetzt für nur 7,99 € dauerhaft frei. Nach der Freischaltung hast du uneingeschränkten Zugriff auf alle Lernmodi, Gruppenfunktionen, Auszeichnungen und Statistiken.')}
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-sc-orange hover:bg-sc-orange/90 text-white"
            >
              <Crown className="h-4 w-4 mr-2" />
              {getText('trialExpired.upgradeButton', 'Jetzt für 7,99 € freischalten')}
            </Button>

            <Button 
              variant="ghost" 
              onClick={handleClose}
              className="w-full text-muted-foreground"
            >
              {getText('trialExpired.laterButton', 'Später erinnern')}
            </Button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-sc-green rounded-full mr-2"></div>
                {getText('trialExpired.features.unlimited', 'Unbegrenzt')}
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-sc-blue rounded-full mr-2"></div>
                {getText('trialExpired.features.collaboration', 'Zusammenarbeit')}
              </div>
            </div>
          </div>
        </CardContent>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </Card>
    </div>
  );
}