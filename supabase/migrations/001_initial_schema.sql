-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    trial_ends_at TIMESTAMPTZ,
    is_premium BOOLEAN DEFAULT FALSE,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_count INTEGER DEFAULT 0,
    last_activity TIMESTAMPTZ,
    preferred_language TEXT DEFAULT 'de' CHECK (preferred_language IN ('de', 'en')),
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    onboarding_completed BOOLEAN DEFAULT FALSE
);

-- Create folders table
CREATE TABLE public.folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (LENGTH(name) >= 1 AND LENGTH(name) <= 50),
    color TEXT NOT NULL CHECK (color IN ('#7EC4FF', '#6EE7B7', '#FFF58F', '#FFD085', '#FF8FA3', '#BFA7FF', '#60EFFF', '#FF8787')),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    order_index INTEGER DEFAULT 0
);

-- Create card_sets table
CREATE TABLE public.card_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (LENGTH(name) >= 1 AND LENGTH(name) <= 100),
    description TEXT,
    folder_id UUID NOT NULL REFERENCES public.folders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_public BOOLEAN DEFAULT FALSE,
    share_token TEXT UNIQUE,
    order_index INTEGER DEFAULT 0
);

-- Create flashcards table
CREATE TABLE public.flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_set_id UUID NOT NULL REFERENCES public.card_sets(id) ON DELETE CASCADE,
    front_content JSONB NOT NULL DEFAULT '[]',
    back_content JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    order_index INTEGER DEFAULT 0,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    last_reviewed TIMESTAMPTZ,
    next_review TIMESTAMPTZ,
    review_count INTEGER DEFAULT 0
);

-- Create groups table
CREATE TABLE public.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (LENGTH(name) >= 1 AND LENGTH(name) <= 50),
    description TEXT,
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    invite_code TEXT NOT NULL UNIQUE DEFAULT SUBSTRING(MD5(RANDOM()::TEXT), 1, 8),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create group_memberships table
CREATE TABLE public.group_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(group_id, user_id)
);

-- Create user_badges table
CREATE TABLE public.user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    badge_type TEXT NOT NULL CHECK (badge_type IN ('kartenguru', 'gruppenleader', 'ordnerprofi', 'lernchamp', 'streak-koenig', 'quiz-master', 'erklaerbaer', 'marathon-lerner')),
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB,
    UNIQUE(user_id, badge_type)
);

-- Create study_sessions table
CREATE TABLE public.study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    card_set_id UUID NOT NULL REFERENCES public.card_sets(id) ON DELETE CASCADE,
    study_mode TEXT NOT NULL CHECK (study_mode IN ('flashcards', 'learn', 'write', 'test', 'match')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    cards_studied INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_answers INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_folders_user_id ON public.folders(user_id);
CREATE INDEX idx_folders_parent_id ON public.folders(parent_id);
CREATE INDEX idx_card_sets_folder_id ON public.card_sets(folder_id);
CREATE INDEX idx_card_sets_user_id ON public.card_sets(user_id);
CREATE INDEX idx_flashcards_card_set_id ON public.flashcards(card_set_id);
CREATE INDEX idx_flashcards_next_review ON public.flashcards(next_review);
CREATE INDEX idx_groups_owner_id ON public.groups(owner_id);
CREATE INDEX idx_groups_invite_code ON public.groups(invite_code);
CREATE INDEX idx_group_memberships_group_id ON public.group_memberships(group_id);
CREATE INDEX idx_group_memberships_user_id ON public.group_memberships(user_id);
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX idx_study_sessions_card_set_id ON public.study_sessions(card_set_id);

-- Create functions for updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON public.folders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_card_sets_updated_at BEFORE UPDATE ON public.card_sets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_flashcards_updated_at BEFORE UPDATE ON public.flashcards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON public.groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check folder depth limit
CREATE OR REPLACE FUNCTION public.check_folder_depth()
RETURNS TRIGGER AS $$
DECLARE
    depth INTEGER := 0;
    current_parent UUID := NEW.parent_id;
BEGIN
    -- Check folder depth limit
    WHILE current_parent IS NOT NULL AND depth < 10 LOOP
        depth := depth + 1;
        SELECT parent_id INTO current_parent FROM public.folders WHERE id = current_parent;
    END LOOP;
    
    IF depth >= 10 THEN
        RAISE EXCEPTION 'Maximum folder depth of 10 levels exceeded';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for folder depth check
CREATE TRIGGER check_folder_depth_trigger BEFORE INSERT OR UPDATE ON public.folders FOR EACH ROW EXECUTE FUNCTION public.check_folder_depth();

-- Function to check folders per level limit
CREATE OR REPLACE FUNCTION public.check_folders_per_level()
RETURNS TRIGGER AS $$
DECLARE
    folder_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO folder_count 
    FROM public.folders 
    WHERE user_id = NEW.user_id 
    AND parent_id IS NOT DISTINCT FROM NEW.parent_id;
    
    IF folder_count >= 20 THEN
        RAISE EXCEPTION 'Maximum of 20 folders per level exceeded';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for folders per level check
CREATE TRIGGER check_folders_per_level_trigger BEFORE INSERT ON public.folders FOR EACH ROW EXECUTE FUNCTION public.check_folders_per_level();

-- Function to check cards per set limit
CREATE OR REPLACE FUNCTION public.check_cards_per_set()
RETURNS TRIGGER AS $$
DECLARE
    card_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO card_count 
    FROM public.flashcards 
    WHERE card_set_id = NEW.card_set_id;
    
    IF card_count >= 100 THEN
        RAISE EXCEPTION 'Maximum of 100 cards per set exceeded';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for cards per set check
CREATE TRIGGER check_cards_per_set_trigger BEFORE INSERT ON public.flashcards FOR EACH ROW EXECUTE FUNCTION public.check_cards_per_set();

-- Function to generate unique share tokens
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS TEXT AS $$
BEGIN
    RETURN SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT), 1, 16);
END;
$$ language 'plpgsql';

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Folders policies
CREATE POLICY "Users can view their own folders" ON public.folders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own folders" ON public.folders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own folders" ON public.folders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own folders" ON public.folders FOR DELETE USING (auth.uid() = user_id);

-- Card sets policies
CREATE POLICY "Users can view their own card sets" ON public.card_sets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public card sets can be viewed by anyone" ON public.card_sets FOR SELECT USING (is_public = true);
CREATE POLICY "Users can create their own card sets" ON public.card_sets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own card sets" ON public.card_sets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own card sets" ON public.card_sets FOR DELETE USING (auth.uid() = user_id);

-- Flashcards policies
CREATE POLICY "Users can view cards from their sets" ON public.flashcards FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.card_sets WHERE id = card_set_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view cards from public sets" ON public.flashcards FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.card_sets WHERE id = card_set_id AND is_public = true)
);
CREATE POLICY "Users can create cards in their sets" ON public.flashcards FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.card_sets WHERE id = card_set_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update cards in their sets" ON public.flashcards FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.card_sets WHERE id = card_set_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete cards from their sets" ON public.flashcards FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.card_sets WHERE id = card_set_id AND user_id = auth.uid())
);

-- Groups policies
CREATE POLICY "Users can view groups they own or are members of" ON public.groups FOR SELECT USING (
    auth.uid() = owner_id OR 
    EXISTS (SELECT 1 FROM public.group_memberships WHERE group_id = id AND user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "Users can create groups" ON public.groups FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Group owners can update their groups" ON public.groups FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Group owners can delete their groups" ON public.groups FOR DELETE USING (auth.uid() = owner_id);

-- Group memberships policies
CREATE POLICY "Users can view memberships for their groups" ON public.group_memberships FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.groups WHERE id = group_id AND (owner_id = auth.uid() OR auth.uid() = user_id))
);
CREATE POLICY "Group owners can add members" ON public.group_memberships FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.groups WHERE id = group_id AND owner_id = auth.uid())
);
CREATE POLICY "Group owners can update memberships" ON public.group_memberships FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.groups WHERE id = group_id AND owner_id = auth.uid())
);
CREATE POLICY "Group owners and members can remove themselves" ON public.group_memberships FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.groups WHERE id = group_id AND owner_id = auth.uid()) OR
    user_id = auth.uid()
);

-- User badges policies
CREATE POLICY "Users can view their own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can earn badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Study sessions policies
CREATE POLICY "Users can view their own study sessions" ON public.study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own study sessions" ON public.study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own study sessions" ON public.study_sessions FOR UPDATE USING (auth.uid() = user_id);