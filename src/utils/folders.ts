import { supabase } from '@/lib/supabase';
import type { 
  Folder, 
  FolderInsert, 
  FolderUpdate, 
  FolderWithChildren,
  StudyCardColor 
} from '@/types';

export const folders = {
  async getAll(userId: string): Promise<FolderWithChildren[]> {
    const { data, error } = await supabase
      .from('folders')
      .select(`
        *,
        card_sets:card_sets(id, name, created_at, updated_at)
      `)
      .eq('user_id', userId)
      .order('order_index', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return buildFolderTree(data || []);
  },

  async getById(id: string, userId: string): Promise<FolderWithChildren | null> {
    const { data, error } = await supabase
      .from('folders')
      .select(`
        *,
        card_sets:card_sets(id, name, created_at, updated_at)
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    return data;
  },

  async create(folder: FolderInsert): Promise<Folder> {
    const { data, error } = await supabase
      .from('folders')
      .insert(folder)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async update(id: string, updates: FolderUpdate, userId: string): Promise<Folder> {
    const { data, error } = await supabase
      .from('folders')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async delete(id: string, userId: string): Promise<void> {
    // First check if folder has children or card sets
    const { data: children } = await supabase
      .from('folders')
      .select('id')
      .eq('parent_id', id);

    const { data: cardSets } = await supabase
      .from('card_sets')
      .select('id')
      .eq('folder_id', id);

    if (children && children.length > 0) {
      throw new Error('Cannot delete folder with subfolders. Move or delete subfolders first.');
    }

    if (cardSets && cardSets.length > 0) {
      throw new Error('Cannot delete folder with card sets. Move or delete card sets first.');
    }

    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
  },

  async move(folderId: string, newParentId: string | null, userId: string): Promise<Folder> {
    // Check for circular reference
    if (newParentId && await isCircularReference(folderId, newParentId)) {
      throw new Error('Cannot move folder: this would create a circular reference');
    }

    // Check depth limit
    if (newParentId && await getFolderDepth(newParentId) >= 9) {
      throw new Error('Cannot move folder: maximum depth of 10 levels would be exceeded');
    }

    const { data, error } = await supabase
      .from('folders')
      .update({ parent_id: newParentId })
      .eq('id', folderId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async reorder(folderIds: string[], userId: string): Promise<void> {
    // Update each folder's order_index individually
    for (let i = 0; i < folderIds.length; i++) {
      const { error } = await supabase
        .from('folders')
        .update({ order_index: i })
        .eq('id', folderIds[i])
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }
    }
  },

  async getFolderPath(folderId: string): Promise<Folder[]> {
    const path: Folder[] = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const { data, error }: { data: Folder | null, error: any } = await supabase
        .from('folders')
        .select('*')
        .eq('id', currentId)
        .single();

      if (error || !data) {
        break;
      }

      path.unshift(data);
      currentId = data.parent_id;
    }

    return path;
  },

  async searchFolders(query: string, userId: string): Promise<Folder[]> {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', userId)
      .ilike('name', `%${query}%`)
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  async getFolderStats(folderId: string): Promise<{
    cardCount: number;
    subfolderCount: number;
    totalCards: number;
  }> {
    // Get direct card sets count
    const { count: cardCount } = await supabase
      .from('card_sets')
      .select('*', { count: 'exact', head: true })
      .eq('folder_id', folderId);

    // Get direct subfolders count
    const { count: subfolderCount } = await supabase
      .from('folders')
      .select('*', { count: 'exact', head: true })
      .eq('parent_id', folderId);

    // Get total cards count (including subfolders) - this would need a recursive query
    // For now, return the direct count
    const totalCards = cardCount || 0;

    return {
      cardCount: cardCount || 0,
      subfolderCount: subfolderCount || 0,
      totalCards,
    };
  },
};

function buildFolderTree(flatFolders: any[]): FolderWithChildren[] {
  const folderMap = new Map<string, FolderWithChildren>();
  const rootFolders: FolderWithChildren[] = [];

  // First pass: create all folders
  flatFolders.forEach(folder => {
    folderMap.set(folder.id, {
      ...folder,
      children: [],
      cardSets: folder.card_sets || [],
    });
  });

  // Second pass: build the tree
  flatFolders.forEach(folder => {
    const currentFolder = folderMap.get(folder.id)!;
    
    if (folder.parent_id) {
      const parent = folderMap.get(folder.parent_id);
      if (parent) {
        parent.children!.push(currentFolder);
      } else {
        // Parent not found, treat as root
        rootFolders.push(currentFolder);
      }
    } else {
      rootFolders.push(currentFolder);
    }
  });

  // Sort children by order_index
  const sortFolders = (folders: FolderWithChildren[]) => {
    folders.sort((a, b) => a.order_index - b.order_index);
    folders.forEach(folder => {
      if (folder.children) {
        sortFolders(folder.children);
      }
    });
  };

  sortFolders(rootFolders);
  return rootFolders;
}

async function isCircularReference(folderId: string, newParentId: string): Promise<boolean> {
  let currentId: string | null = newParentId;
  
  while (currentId) {
    if (currentId === folderId) {
      return true;
    }

    const { data }: { data: { parent_id: string | null } | null } = await supabase
      .from('folders')
      .select('parent_id')
      .eq('id', currentId)
      .single();

    currentId = data?.parent_id || null;
  }

  return false;
}

async function getFolderDepth(folderId: string): Promise<number> {
  let depth = 0;
  let currentId: string | null = folderId;

  while (currentId) {
    const { data }: { data: { parent_id: string | null } | null } = await supabase
      .from('folders')
      .select('parent_id')
      .eq('id', currentId)
      .single();

    if (!data) break;

    depth++;
    currentId = data.parent_id;
  }

  return depth;
}

export const folderUtils = {
  getRandomColor(): StudyCardColor {
    const colors: StudyCardColor[] = [
      '#7EC4FF', '#6EE7B7', '#FFF58F', '#FFD085',
      '#FF8FA3', '#BFA7FF', '#60EFFF', '#FF8787'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  },

  validateFolderName(name: string): { isValid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
      return { isValid: false, error: 'Folder name cannot be empty' };
    }

    if (name.length > 50) {
      return { isValid: false, error: 'Folder name cannot exceed 50 characters' };
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(name)) {
      return { isValid: false, error: 'Folder name contains invalid characters' };
    }

    return { isValid: true };
  },

  getFolderIcon(folder: Folder): string {
    // Return emoji based on folder name or color
    const name = folder.name.toLowerCase();
    
    if (name.includes('math') || name.includes('mathematik')) return '🔢';
    if (name.includes('deutsch') || name.includes('language')) return '📚';
    if (name.includes('geschichte') || name.includes('history')) return '🏛️';
    if (name.includes('science') || name.includes('wissenschaft')) return '🔬';
    if (name.includes('kunst') || name.includes('art')) return '🎨';
    if (name.includes('musik') || name.includes('music')) return '🎵';
    if (name.includes('sport')) return '⚽';
    if (name.includes('computer') || name.includes('tech')) return '💻';
    
    // Default based on color
    switch (folder.color) {
      case '#7EC4FF': return '💙'; // blue
      case '#6EE7B7': return '💚'; // green
      case '#FFF58F': return '💛'; // yellow
      case '#FFD085': return '🧡'; // orange
      case '#FF8FA3': return '💗'; // pink
      case '#BFA7FF': return '💜'; // purple
      case '#60EFFF': return '🩵'; // turquoise
      case '#FF8787': return '❤️'; // red
      default: return '📁';
    }
  },

  formatFolderPath(path: Folder[]): string {
    return path.map(folder => folder.name).join(' / ');
  },

  exportFolderStructure(folders: FolderWithChildren[]): string {
    const exportFolder = (folder: FolderWithChildren, depth = 0): string => {
      const indent = '  '.repeat(depth);
      let result = `${indent}- ${folder.name} (${folder.cardSets?.length || 0} sets)\n`;
      
      if (folder.children) {
        folder.children.forEach(child => {
          result += exportFolder(child, depth + 1);
        });
      }
      
      return result;
    };

    let result = 'Folder Structure:\n';
    folders.forEach(folder => {
      result += exportFolder(folder);
    });
    
    return result;
  },
};