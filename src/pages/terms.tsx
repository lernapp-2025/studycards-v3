import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BookOpen, ArrowLeft, FileText, Shield } from 'lucide-react';

export default function TermsPage() {
  const { t } = useTranslation('terms');

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
              {t('terms:backToHome')}
            </Link>
          </Button>
        </div>
      </header>

      <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-sc-orange to-sc-red rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('terms:title')}
            </h1>
            
            <p className="text-lg text-muted-foreground">
              {t('terms:lastUpdated')}: 8. August 2024
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle>{t('terms:sections.intro.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms:sections.intro.content')}
                </p>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card>
              <CardHeader>
                <CardTitle>{t('terms:sections.service.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('terms:sections.service.description')}
                </p>
                
                <div>
                  <h4 className="font-medium mb-2">{t('terms:sections.service.features.title')}</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>{t('terms:sections.service.features.editor')}</li>
                    <li>{t('terms:sections.service.features.folders')}</li>
                    <li>{t('terms:sections.service.features.learning')}</li>
                    <li>{t('terms:sections.service.features.collaboration')}</li>
                    <li>{t('terms:sections.service.features.statistics')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Account Registration */}
            <Card>
              <CardHeader>
                <CardTitle>{t('terms:sections.account.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('terms:sections.account.registration.title')}</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>{t('terms:sections.account.registration.accurate')}</li>
                    <li>{t('terms:sections.account.registration.secure')}</li>
                    <li>{t('terms:sections.account.registration.personal')}</li>
                    <li>{t('terms:sections.account.registration.age')}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t('terms:sections.account.trial.title')}</h4>
                  <p className="text-muted-foreground">
                    {t('terms:sections.account.trial.content')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            <Card>
              <CardHeader>
                <CardTitle>{t('terms:sections.payment.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-sc-green/10 p-4 rounded-lg">
                    <h4 className="font-medium text-sc-green mb-2">{t('terms:sections.payment.price.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('terms:sections.payment.price.content')}</p>
                  </div>
                  
                  <div className="bg-sc-blue/10 p-4 rounded-lg">
                    <h4 className="font-medium text-sc-blue mb-2">{t('terms:sections.payment.processing.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('terms:sections.payment.processing.content')}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t('terms:sections.payment.refunds.title')}</h4>
                  <p className="text-muted-foreground">
                    {t('terms:sections.payment.refunds.content')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Content */}
            <Card>
              <CardHeader>
                <CardTitle>{t('terms:sections.content.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('terms:sections.content.ownership.title')}</h4>
                  <p className="text-muted-foreground">
                    {t('terms:sections.content.ownership.content')}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t('terms:sections.content.responsibility.title')}</h4>
                  <p className="text-muted-foreground">
                    {t('terms:sections.content.responsibility.content')}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t('terms:sections.content.prohibited.title')}</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>{t('terms:sections.content.prohibited.illegal')}</li>
                    <li>{t('terms:sections.content.prohibited.harmful')}</li>
                    <li>{t('terms:sections.content.prohibited.copyright')}</li>
                    <li>{t('terms:sections.content.prohibited.malware')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Acceptable Use */}
            <Card>
              <CardHeader>
                <CardTitle>{t('terms:sections.usage.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-sc-green">{t('terms:sections.usage.allowed.title')}</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>{t('terms:sections.usage.allowed.personal')}</li>
                    <li>{t('terms:sections.usage.allowed.educational')}</li>
                    <li>{t('terms:sections.usage.allowed.collaboration')}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-sc-red">{t('terms:sections.usage.prohibited.title')}</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>{t('terms:sections.usage.prohibited.automation')}</li>
                    <li>{t('terms:sections.usage.prohibited.reverse')}</li>
                    <li>{t('terms:sections.usage.prohibited.resale')}</li>
                    <li>{t('terms:sections.usage.prohibited.interference')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Privacy and Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  {t('terms:sections.privacy.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {t('terms:sections.privacy.content')}
                </p>
                
                <Button variant="outline" asChild>
                  <Link href="/privacy">
                    {t('terms:sections.privacy.readPolicy')} →
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Service Availability */}
            <Card>
              <CardHeader>
                <CardTitle>{t('terms:sections.availability.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('terms:sections.availability.content')}
                </p>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle>{t('terms:sections.liability.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('terms:sections.liability.content')}
                </p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle>{t('terms:sections.termination.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('terms:sections.termination.byUser.title')}</h4>
                  <p className="text-muted-foreground">
                    {t('terms:sections.termination.byUser.content')}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t('terms:sections.termination.byUs.title')}</h4>
                  <p className="text-muted-foreground">
                    {t('terms:sections.termination.byUs.content')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle>{t('terms:sections.law.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('terms:sections.law.content')}
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardHeader>
                <CardTitle>{t('terms:sections.changes.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('terms:sections.changes.content')}
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t('terms:sections.contact.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div><strong>StudyCards</strong></div>
                    <div>E-Mail: support@studycards.com</div>
                    <div>Deutschland</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t">
            <div className="flex justify-center space-x-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                {t('terms:footer.privacy')}
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                {t('terms:footer.contact')}
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                {t('terms:footer.home')}
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
    ...(await serverSideTranslations(locale, ['terms'])),
  },
});