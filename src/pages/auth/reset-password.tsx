import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { auth } from '@/utils/auth';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { t } = useTranslation('auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(t('validation.fillAllFields'));
      return;
    }

    setIsLoading(true);
    
    try {
      await auth.resetPassword(email);
      setEmailSent(true);
      toast.success(t('resetPassword.success'));
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || t('resetPassword.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sc-purple/10 via-sc-blue/10 to-sc-green/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">StudyCards</h1>
          <p className="text-muted-foreground">{t('resetPassword.title')}</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('resetPassword.title')}</CardTitle>
            <CardDescription>{t('resetPassword.description')}</CardDescription>
          </CardHeader>

          <CardContent>
            {emailSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-sc-green/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-sc-green" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    {t('resetPassword.success')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Wir haben dir einen Link zum Zurücksetzen des Passworts an <strong>{email}</strong> gesendet.
                  </p>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/login">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('resetPassword.backToLogin')}
                  </Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('resetPassword.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder={t('resetPassword.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="spinner w-4 h-4 mr-2" />
                  ) : null}
                  {t('resetPassword.sendReset')}
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/login">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('resetPassword.backToLogin')}
                  </Link>
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Link 
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['auth', 'common'])),
  },
});