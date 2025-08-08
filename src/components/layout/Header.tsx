import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Menu,
  Search, 
  Bell, 
  Settings, 
  User, 
  Sun, 
  Moon,
  LogOut,
  Crown
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut, isTrialExpired, isPremium } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation('common');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getTrialDaysLeft = () => {
    if (isPremium || !user?.trial_ends_at) return null;
    
    const trialEnd = new Date(user.trial_ends_at);
    const today = new Date();
    const diffTime = trialEnd.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const trialDaysLeft = getTrialDaysLeft();

  return (
    <header className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder={t('header.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 lg:w-80"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center space-x-3">
          {/* Trial Status */}
          {!isPremium && trialDaysLeft !== null && (
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-sc-orange/10 rounded-full">
              <Crown className="h-4 w-4 text-sc-orange" />
              <span className="text-sm text-sc-orange">
                {trialDaysLeft > 0 
                  ? t('header.trialDaysLeft', { days: trialDaysLeft })
                  : t('header.trialExpired')
                }
              </span>
              {trialDaysLeft > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push('/pricing')}
                  className="text-xs h-6 px-2"
                >
                  {t('header.upgrade')}
                </Button>
              )}
            </div>
          )}

          {/* Premium Badge */}
          {isPremium && (
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-sc-purple/10 rounded-full">
              <Crown className="h-4 w-4 text-sc-purple" />
              <span className="text-sm text-sc-purple">Premium</span>
            </div>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:flex"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-sc-red rounded-full"></div>
          </Button>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-sc-blue to-sc-green rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium">{user?.email}</div>
                <div className="text-xs text-muted-foreground">
                  Level {user?.level} • {user?.xp} XP
                </div>
              </div>
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-border">
                  <div className="font-medium text-sm">{user?.email}</div>
                  <div className="text-xs text-muted-foreground">
                    Level {user?.level} • {user?.xp} XP
                  </div>
                </div>
                
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {t('header.profile')}
                  </Link>
                  
                  <Link
                    href="/settings"
                    className="flex items-center px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {t('header.settings')}
                  </Link>

                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={toggleTheme}
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent sm:hidden"
                    >
                      {theme === 'light' ? (
                        <>
                          <Moon className="h-4 w-4 mr-2" />
                          {t('header.darkMode')}
                        </>
                      ) : (
                        <>
                          <Sun className="h-4 w-4 mr-2" />
                          {t('header.lightMode')}
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-accent"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('header.signOut')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <form onSubmit={handleSearch} className="sm:hidden mt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={t('header.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </form>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}