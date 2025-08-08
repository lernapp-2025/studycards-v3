import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BookOpen, ArrowLeft, Mail, Shield } from 'lucide-react';

export default function PrivacyPage() {
  const { t } = useTranslation('privacy');

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
          
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('privacy:backToHome')}
            </Link>
          </Button>
        </div>
      </header>

      <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-sc-green to-sc-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('privacy:title')}
            </h1>
            
            <p className="text-lg text-muted-foreground">
              {t('privacy:lastUpdated')}: 8. August 2024
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  {t('privacy:sections.intro.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>{t('privacy:sections.intro.content')}</p>
                
                <div className="bg-sc-green/10 border border-sc-green/20 rounded-lg p-4 not-prose mt-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-sc-green mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-sc-green mb-1">
                        {t('privacy:gdprCompliant')}
                      </div>
                      <div className="text-muted-foreground">
                        {t('privacy:gdprDescription')}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Collection */}
            <Card>
              <CardHeader>
                <CardTitle>{t('privacy:sections.dataCollection.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{t('privacy:sections.dataCollection.personal.title')}</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>{t('privacy:sections.dataCollection.personal.email')}</li>
                    <li>{t('privacy:sections.dataCollection.personal.password')}</li>
                    <li>{t('privacy:sections.dataCollection.personal.preferences')}</li>
                    <li>{t('privacy:sections.dataCollection.personal.content')}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{t('privacy:sections.dataCollection.usage.title')}</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>{t('privacy:sections.dataCollection.usage.studyStats')}</li>
                    <li>{t('privacy:sections.dataCollection.usage.loginTimes')}</li>
                    <li>{t('privacy:sections.dataCollection.usage.features')}</li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">{t('privacy:sections.dataCollection.notCollected.title')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('privacy:sections.dataCollection.notCollected.content')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Usage */}
            <Card>
              <CardHeader>
                <CardTitle>{t('privacy:sections.dataUsage.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-sc-blue rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{t('privacy:sections.dataUsage.service.title')}</div>
                      <div className="text-sm text-muted-foreground">{t('privacy:sections.dataUsage.service.content')}</div>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-sc-green rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{t('privacy:sections.dataUsage.improvement.title')}</div>
                      <div className="text-sm text-muted-foreground">{t('privacy:sections.dataUsage.improvement.content')}</div>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-sc-orange rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{t('privacy:sections.dataUsage.communication.title')}</div>
                      <div className="text-sm text-muted-foreground">{t('privacy:sections.dataUsage.communication.content')}</div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Storage */}
            <Card>
              <CardHeader>
                <CardTitle>{t('privacy:sections.dataStorage.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-sc-blue/10 p-4 rounded-lg">
                    <h4 className="font-medium text-sc-blue mb-2">{t('privacy:sections.dataStorage.location.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('privacy:sections.dataStorage.location.content')}</p>
                  </div>
                  
                  <div className="bg-sc-green/10 p-4 rounded-lg">
                    <h4 className="font-medium text-sc-green mb-2">{t('privacy:sections.dataStorage.security.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('privacy:sections.dataStorage.security.content')}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t('privacy:sections.dataStorage.retention.title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('privacy:sections.dataStorage.retention.content')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle>{t('privacy:sections.rights.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">{t('privacy:sections.rights.access.title')}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• {t('privacy:sections.rights.access.view')}</li>
                      <li>• {t('privacy:sections.rights.access.download')}</li>
                      <li>• {t('privacy:sections.rights.access.update')}</li>
                      <li>• {t('privacy:sections.rights.access.delete')}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">{t('privacy:sections.rights.gdpr.title')}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• {t('privacy:sections.rights.gdpr.rectification')}</li>
                      <li>• {t('privacy:sections.rights.gdpr.erasure')}</li>
                      <li>• {t('privacy:sections.rights.gdpr.portability')}</li>
                      <li>• {t('privacy:sections.rights.gdpr.objection')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-sc-purple/10 border border-sc-purple/20 rounded-lg p-4 mt-6">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-sc-purple mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sc-purple mb-1">
                        {t('privacy:sections.rights.contact.title')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('privacy:sections.rights.contact.content')}
                      </div>
                      <a 
                        href="mailto:privacy@studycards.com" 
                        className="text-sm text-sc-purple hover:underline font-medium"
                      >
                        privacy@studycards.com
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Third Parties */}
            <Card>
              <CardHeader>
                <CardTitle>{t('privacy:sections.thirdParties.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Supabase (Database & Authentication)</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('privacy:sections.thirdParties.supabase')}
                    </p>
                    <a 
                      href="https://supabase.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Privacy Policy von Supabase →
                    </a>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Stripe (Payment Processing)</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('privacy:sections.thirdParties.stripe')}
                    </p>
                    <a 
                      href="https://stripe.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Privacy Policy von Stripe →
                    </a>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Vercel (Hosting)</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('privacy:sections.thirdParties.vercel')}
                    </p>
                    <a 
                      href="https://vercel.com/legal/privacy-policy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Privacy Policy von Vercel →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t('privacy:sections.contact.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">{t('privacy:sections.contact.general.title')}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>StudyCards</div>
                      <div>E-Mail: support@studycards.com</div>
                      <div>Deutschland</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">{t('privacy:sections.contact.dpo.title')}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>E-Mail: privacy@studycards.com</div>
                      <div>{t('privacy:sections.contact.dpo.response')}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Changes */}
            <Card>
              <CardHeader>
                <CardTitle>{t('privacy:sections.changes.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('privacy:sections.changes.content')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t">
            <div className="flex justify-center space-x-6">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                {t('privacy:footer.terms')}
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                {t('privacy:footer.contact')}
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                {t('privacy:footer.home')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['privacy'])),
  },
});