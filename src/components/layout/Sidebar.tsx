import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { 
  BookOpen,
  Home,
  FolderOpen,
  Users,
  BarChart3,
  Settings,
  Plus,
  ChevronRight,
  X
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  badge?: string;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const mainNavItems: NavItem[] = [
    {
      name: t('nav.dashboard'),
      href: '/dashboard',
      icon: Home,
      active: router.pathname === '/dashboard',
    },
    {
      name: t('nav.folders'),
      href: '/folders',
      icon: FolderOpen,
      active: router.pathname.startsWith('/folders'),
    },
    {
      name: t('nav.groups'),
      href: '/groups',
      icon: Users,
      active: router.pathname.startsWith('/groups'),
    },
    {
      name: t('nav.statistics'),
      href: '/statistics',
      icon: BarChart3,
      active: router.pathname === '/statistics',
    },
  ];

  const handleNavClick = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-sc-blue to-sc-green rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">StudyCards</span>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            {/* Main Navigation */}
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    item.active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto bg-sc-red text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t('nav.quickActions')}
                </h3>
              </div>
              
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  onClick={() => handleNavClick('/folders/new')}
                  className="w-full justify-start text-sm font-medium"
                >
                  <Plus className="h-4 w-4 mr-3" />
                  {t('nav.newFolder')}
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => handleNavClick('/sets/new')}
                  className="w-full justify-start text-sm font-medium"
                >
                  <Plus className="h-4 w-4 mr-3" />
                  {t('nav.newSet')}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => handleNavClick('/groups/new')}
                  className="w-full justify-start text-sm font-medium"
                >
                  <Plus className="h-4 w-4 mr-3" />
                  {t('nav.newGroup')}
                </Button>
              </div>
            </div>

            {/* Recent Items */}
            <div className="border-t border-border pt-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t('nav.recent')}
                </h3>
              </div>
              
              <div className="space-y-1">
                {/* This would be populated with recent folders/sets */}
                <div className="text-sm text-muted-foreground px-3 py-2">
                  {t('nav.noRecent')}
                </div>
              </div>
            </div>

            {/* Favorites */}
            <div className="border-t border-border pt-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t('nav.favorites')}
                </h3>
              </div>
              
              <div className="space-y-1">
                {/* This would be populated with favorited folders/sets */}
                <div className="text-sm text-muted-foreground px-3 py-2">
                  {t('nav.noFavorites')}
                </div>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <Button
              variant="ghost"
              onClick={() => handleNavClick('/settings')}
              className="w-full justify-start"
            >
              <Settings className="h-5 w-5 mr-3" />
              {t('nav.settings')}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}