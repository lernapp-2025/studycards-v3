import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import FolderTree from '@/components/folders/FolderTree';
import { FolderWithChildren } from '@/types';
import { folders } from '@/utils/folders';
import { 
  Search, 
  Plus, 
  Grid3X3, 
  List, 
  SortAsc, 
  Filter,
  FolderPlus,
  BookOpen,
  Users
} from 'lucide-react';

type ViewMode = 'tree' | 'grid' | 'list';
type SortMode = 'name' | 'created' | 'updated' | 'size';

export default function FoldersPage() {
  const { user } = useAuth();
  const { t } = useTranslation(['common', 'folders']);
  const router = useRouter();
  
  const [folderData, setFolderData] = useState<FolderWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [sortMode, setSortMode] = useState<SortMode>('name');
  const [selectedFolder, setSelectedFolder] = useState<FolderWithChildren | null>(null);

  useEffect(() => {
    if (user) {
      loadFolders();
    }
  }, [user]);

  const loadFolders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await folders.getAll(user.id);
      setFolderData(data);
    } catch (error: any) {
      console.error('Error loading folders:', error);
      toast.error(error.message || t('folders:loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleFolderSelect = (folder: FolderWithChildren) => {
    setSelectedFolder(folder);
    router.push(`/folders/${folder.id}`);
  };

  const handleCreateFolder = () => {
    router.push('/folders/new');
  };

  const handleCreateSet = () => {
    if (selectedFolder) {
      router.push(`/sets/new?folder=${selectedFolder.id}`);
    } else {
      router.push('/sets/new');
    }
  };

  const filteredFolders = folderData.filter(folder => {
    if (!searchQuery) return true;
    return folder.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getFolderStats = () => {
    let totalFolders = 0;
    let totalSets = 0;
    let totalCards = 0;

    const countItems = (folders: FolderWithChildren[]) => {
      folders.forEach(folder => {
        totalFolders++;
        totalSets += folder.cardSets?.length || 0;
        // TODO: Add card count when available
        if (folder.children) {
          countItems(folder.children);
        }
      });
    };

    countItems(folderData);
    return { totalFolders, totalSets, totalCards };
  };

  const stats = getFolderStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('folders:title')}
          </h1>
          <p className="text-muted-foreground">
            {t('folders:subtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={handleCreateSet} variant="outline">
            <BookOpen className="h-4 w-4 mr-2" />
            {t('folders:newSet')}
          </Button>
          <Button onClick={handleCreateFolder}>
            <Plus className="h-4 w-4 mr-2" />
            {t('folders:newFolder')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('folders:stats.folders')}
            </CardTitle>
            <FolderPlus className="h-4 w-4 text-sc-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFolders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('folders:stats.sets')}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-sc-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('folders:stats.cards')}
            </CardTitle>
            <div className="w-4 h-4 bg-sc-orange rounded text-white flex items-center justify-center text-xs">
              {stats.totalCards}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCards}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('folders:searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'tree' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('tree')}
          >
            <List className="h-4 w-4" />
          </Button>
          
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm">
            <SortAsc className="h-4 w-4 mr-1" />
            {t('folders:sort.name')}
          </Button>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            {t('folders:filter')}
          </Button>
        </div>
      </div>

      {/* Content */}
      {folderData.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FolderPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl mb-2">
              {t('folders:empty.title')}
            </CardTitle>
            <CardDescription className="mb-4">
              {t('folders:empty.description')}
            </CardDescription>
            <div className="flex justify-center space-x-2">
              <Button onClick={handleCreateFolder}>
                <Plus className="h-4 w-4 mr-2" />
                {t('folders:newFolder')}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/groups">
                  <Users className="h-4 w-4 mr-2" />
                  {t('folders:joinGroup')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Folder Tree */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FolderPlus className="h-5 w-5 mr-2" />
                  {t('folders:structure')}
                </CardTitle>
                <CardDescription>
                  {t('folders:structureDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {viewMode === 'tree' ? (
                  <FolderTree
                    folders={filteredFolders}
                    onFolderSelect={handleFolderSelect}
                    onFolderUpdate={loadFolders}
                    selectedFolderId={selectedFolder?.id}
                  />
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    {t('folders:otherViewsComingSoon')}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            {selectedFolder ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedFolder.name}</CardTitle>
                  <CardDescription>
                    {t('folders:folderInfo')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: selectedFolder.color }}
                    />
                    <span className="text-sm">
                      {t('folders:color')}: {selectedFolder.color}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <strong>{t('folders:cardSets')}:</strong> {selectedFolder.cardSets?.length || 0}
                  </div>
                  
                  <div className="text-sm">
                    <strong>{t('folders:subfolders')}:</strong> {selectedFolder.children?.length || 0}
                  </div>

                  <div className="pt-3 space-y-2">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => router.push(`/folders/${selectedFolder.id}`)}
                    >
                      {t('folders:openFolder')}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={handleCreateSet}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('folders:addSet')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <FolderPlus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {t('folders:selectFolder')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'folders'])),
  },
});