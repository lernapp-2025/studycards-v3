import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  FolderOpen, 
  Users, 
  BookOpen, 
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Plus
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation(['common', 'dashboard']);
  const [stats, setStats] = useState({
    totalCards: 0,
    totalFolders: 0,
    totalGroups: 0,
    studyStreak: 0,
    cardsStudiedToday: 0,
    weeklyProgress: 0
  });

  useEffect(() => {
    // TODO: Fetch user statistics from API
    // For now, using mock data
    setStats({
      totalCards: 125,
      totalFolders: 8,
      totalGroups: 3,
      studyStreak: user?.streak_count || 0,
      cardsStudiedToday: 15,
      weeklyProgress: 85
    });
  }, [user]);

  const quickActions = [
    {
      title: t('dashboard:quickActions.newFolder'),
      description: t('dashboard:quickActions.newFolderDesc'),
      icon: <FolderOpen className="h-6 w-6" />,
      href: '/folders/new',
      color: 'text-sc-blue bg-sc-blue/10'
    },
    {
      title: t('dashboard:quickActions.newSet'),
      description: t('dashboard:quickActions.newSetDesc'),
      icon: <BookOpen className="h-6 w-6" />,
      href: '/sets/new',
      color: 'text-sc-green bg-sc-green/10'
    },
    {
      title: t('dashboard:quickActions.joinGroup'),
      description: t('dashboard:quickActions.joinGroupDesc'),
      icon: <Users className="h-6 w-6" />,
      href: '/groups/join',
      color: 'text-sc-orange bg-sc-orange/10'
    }
  ];

  const statCards = [
    {
      title: t('dashboard:stats.totalCards'),
      value: stats.totalCards.toString(),
      icon: <BookOpen className="h-5 w-5" />,
      color: 'text-sc-blue',
      change: '+12 diese Woche'
    },
    {
      title: t('dashboard:stats.studyStreak'),
      value: `${stats.studyStreak} Tage`,
      icon: <Zap className="h-5 w-5" />,
      color: 'text-sc-orange',
      change: stats.studyStreak > 0 ? 'Aktiv' : 'Unterbrochen'
    },
    {
      title: t('dashboard:stats.weeklyProgress'),
      value: `${stats.weeklyProgress}%`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-sc-green',
      change: '+5% zur Vorwoche'
    },
    {
      title: t('dashboard:stats.level'),
      value: `Level ${user?.level}`,
      icon: <Trophy className="h-5 w-5" />,
      color: 'text-sc-purple',
      change: `${user?.xp} XP`
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-sc-blue/10 via-sc-green/10 to-sc-purple/10 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t('dashboard:welcome', { name: user?.email.split('@')[0] })}
            </h1>
            <p className="text-muted-foreground">
              {t('dashboard:subtitle')}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button asChild>
              <Link href="/study">
                <Target className="h-4 w-4 mr-2" />
                {t('dashboard:startStudying')}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={stat.color}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          {t('dashboard:quickActionsTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                  {action.icon}
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full">
                  <Link href={action.href}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('dashboard:create')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity & Upcoming Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              {t('dashboard:recentActivity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground text-center py-8">
                {t('dashboard:noRecentActivity')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              {t('dashboard:upcomingReviews')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground text-center py-8">
                {t('dashboard:noUpcomingReviews')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard:dailyGoal')}</CardTitle>
          <CardDescription>
            {t('dashboard:dailyGoalDesc', { studied: stats.cardsStudiedToday, goal: 20 })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div 
              className="bg-sc-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((stats.cardsStudiedToday / 20) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {stats.cardsStudiedToday}/20 Karten
            </span>
            <span className="text-sm font-medium text-sc-green">
              {Math.round((stats.cardsStudiedToday / 20) * 100)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'dashboard'])),
  },
});