import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';

import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { FolderWithChildren } from '@/types';
import { folders, folderUtils } from '@/utils/folders';
import { 
  ChevronRight, 
  ChevronDown, 
  FolderOpen, 
  Folder as FolderIcon,
  MoreHorizontal,
  Plus,
  Edit2,
  Trash2,
  Move,
  BookOpen
} from 'lucide-react';

interface FolderTreeProps {
  folders: FolderWithChildren[];
  onFolderSelect?: (folder: FolderWithChildren) => void;
  onFolderUpdate?: () => void;
  selectedFolderId?: string;
  showActions?: boolean;
}

interface FolderItemProps {
  folder: FolderWithChildren;
  level: number;
  onSelect?: (folder: FolderWithChildren) => void;
  onUpdate?: () => void;
  isSelected?: boolean;
  showActions?: boolean;
  selectedFolderId?: string;
}

export default function FolderTree({ 
  folders, 
  onFolderSelect, 
  onFolderUpdate, 
  selectedFolderId,
  showActions = true 
}: FolderTreeProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const { t } = useTranslation('common');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setDraggedItem(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedItem(null);

    if (!over || active.id === over.id) {
      return;
    }

    try {
      // Handle folder moving logic here
      console.log('Move folder:', active.id, 'to:', over.id);
      // await folders.move(active.id as string, over.id as string, userId);
      onFolderUpdate?.();
      toast.success(t('messages.saved'));
    } catch (error: any) {
      console.error('Error moving folder:', error);
      toast.error(error.message || t('messages.error'));
    }
  };

  const getAllFolderIds = (folderList: FolderWithChildren[]): string[] => {
    const ids: string[] = [];
    const traverse = (items: FolderWithChildren[]) => {
      items.forEach(item => {
        ids.push(item.id);
        if (item.children) {
          traverse(item.children);
        }
      });
    };
    traverse(folderList);
    return ids;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={getAllFolderIds(folders)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-1">
          {folders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              level={0}
              onSelect={onFolderSelect}
              onUpdate={onFolderUpdate}
              isSelected={selectedFolderId === folder.id}
              showActions={showActions}
              selectedFolderId={selectedFolderId}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function FolderItem({ 
  folder, 
  level, 
  onSelect, 
  onUpdate, 
  isSelected, 
  showActions,
  selectedFolderId 
}: FolderItemProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const { t } = useTranslation(['common', 'folders']);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: folder.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasChildren = folder.children && folder.children.length > 0;
  const hasCardSets = folder.cardSets && folder.cardSets.length > 0;
  const totalItems = (folder.children?.length || 0) + (folder.cardSets?.length || 0);

  const handleClick = () => {
    onSelect?.(folder);
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleMenuAction = async (action: string) => {
    setShowMenu(false);
    
    switch (action) {
      case 'edit':
        router.push(`/folders/${folder.id}/edit`);
        break;
      case 'delete':
        if (confirm(t('folders:confirmDelete', { name: folder.name }))) {
          try {
            await folders.delete(folder.id, folder.user_id);
            toast.success(t('folders:deleted'));
            onUpdate?.();
          } catch (error: any) {
            toast.error(error.message);
          }
        }
        break;
      case 'newFolder':
        router.push(`/folders/new?parent=${folder.id}`);
        break;
      case 'newSet':
        router.push(`/sets/new?folder=${folder.id}`);
        break;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative',
        isDragging && 'opacity-50 z-50'
      )}
    >
      <div
        className={cn(
          'flex items-center py-1.5 px-2 rounded-md hover:bg-accent/50 cursor-pointer transition-colors',
          isSelected && 'bg-accent',
          level > 0 && 'ml-4'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
        {...attributes}
        {...listeners}
      >
        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <button
            onClick={handleExpand}
            className="p-1 hover:bg-accent/50 rounded mr-1 flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        {/* Folder Icon */}
        <div 
          className="w-6 h-6 rounded-md flex items-center justify-center mr-2 flex-shrink-0"
          style={{ backgroundColor: `${folder.color}20` }}
        >
          {hasChildren || hasCardSets ? (
            <FolderOpen className="h-4 w-4" style={{ color: folder.color }} />
          ) : (
            <FolderIcon className="h-4 w-4" style={{ color: folder.color }} />
          )}
        </div>

        {/* Folder Name and Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className={cn(
              'text-sm font-medium truncate',
              isSelected && 'text-foreground',
              !isSelected && 'text-muted-foreground group-hover:text-foreground'
            )}>
              {folder.name}
            </span>
            
            {totalItems > 0 && (
              <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                {totalItems}
              </span>
            )}
          </div>
          
          {/* Card Sets Preview */}
          {hasCardSets && isExpanded && (
            <div className="mt-1 ml-8 space-y-0.5">
              {folder.cardSets?.slice(0, 3).map((set) => (
                <div 
                  key={set.id}
                  className="flex items-center text-xs text-muted-foreground py-0.5"
                >
                  <BookOpen className="h-3 w-3 mr-1.5" />
                  <span className="truncate">{set.name}</span>
                </div>
              ))}
              {folder.cardSets && folder.cardSets.length > 3 && (
                <div className="text-xs text-muted-foreground ml-4">
                  +{folder.cardSets.length - 3} more sets
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions Menu */}
        {showActions && (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 h-6 w-6 ml-1"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md shadow-lg z-50 py-1 min-w-[140px]">
                <button
                  onClick={() => handleMenuAction('edit')}
                  className="flex items-center w-full px-3 py-1.5 text-xs hover:bg-accent"
                >
                  <Edit2 className="h-3 w-3 mr-2" />
                  {t('folders:edit')}
                </button>
                
                <button
                  onClick={() => handleMenuAction('newFolder')}
                  className="flex items-center w-full px-3 py-1.5 text-xs hover:bg-accent"
                >
                  <Plus className="h-3 w-3 mr-2" />
                  {t('folders:newSubfolder')}
                </button>
                
                <button
                  onClick={() => handleMenuAction('newSet')}
                  className="flex items-center w-full px-3 py-1.5 text-xs hover:bg-accent"
                >
                  <Plus className="h-3 w-3 mr-2" />
                  {t('folders:newSet')}
                </button>
                
                <div className="border-t border-border my-1" />
                
                <button
                  onClick={() => handleMenuAction('delete')}
                  className="flex items-center w-full px-3 py-1.5 text-xs hover:bg-accent text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  {t('folders:delete')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Child Folders */}
      {hasChildren && isExpanded && (
        <div className="space-y-1">
          {folder.children!.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              level={level + 1}
              onSelect={onSelect}
              onUpdate={onUpdate}
              isSelected={selectedFolderId === child.id}
              showActions={showActions}
              selectedFolderId={selectedFolderId}
            />
          ))}
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}