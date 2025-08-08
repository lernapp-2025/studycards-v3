-- Sample data for development and testing

-- Insert test users (these will be created automatically by Supabase Auth)
-- The users table will be populated via triggers when users sign up

-- Example data structure for card content
-- This shows the JSON structure for front_content and back_content fields

/*
Example card content structure:
{
  "elements": [
    {
      "id": "text-1",
      "type": "text",
      "content": "Was ist die Hauptstadt von Deutschland?",
      "position": { "x": 20, "y": 20 },
      "size": { "width": 260, "height": 40 },
      "style": {
        "fontSize": 18,
        "fontWeight": "bold",
        "color": "#000000",
        "textAlign": "center"
      },
      "zIndex": 1
    },
    {
      "id": "image-1", 
      "type": "image",
      "content": "https://example.com/image.jpg",
      "position": { "x": 50, "y": 80 },
      "size": { "width": 200, "height": 150 },
      "zIndex": 2
    }
  ]
}
*/

-- Sample folder colors from our defined palette
-- Colors: #7EC4FF, #6EE7B7, #FFF58F, #FFD085, #FF8FA3, #BFA7FF, #60EFFF, #FF8787

-- This file serves as documentation for the expected data structure
-- Actual test data will be inserted via the application after user registration

-- Function to create sample data for a user (can be called after user registration)
CREATE OR REPLACE FUNCTION create_sample_data_for_user(user_id UUID, user_email TEXT)
RETURNS VOID AS $$
BEGIN
  -- Create sample folders
  INSERT INTO public.folders (id, name, color, user_id, parent_id, order_index) VALUES
  (uuid_generate_v4(), 'Deutsch', '#7EC4FF', user_id, NULL, 0),
  (uuid_generate_v4(), 'Mathematik', '#6EE7B7', user_id, NULL, 1),
  (uuid_generate_v4(), 'Geschichte', '#FFF58F', user_id, NULL, 2),
  (uuid_generate_v4(), 'Wissenschaft', '#FFD085', user_id, NULL, 3);

  -- Create sample card sets
  WITH folders AS (
    SELECT id, name FROM public.folders WHERE user_id = user_id ORDER BY order_index LIMIT 4
  )
  INSERT INTO public.card_sets (name, description, folder_id, user_id, order_index)
  SELECT 
    CASE 
      WHEN f.name = 'Deutsch' THEN 'Grundwortschatz'
      WHEN f.name = 'Mathematik' THEN 'Algebra Grundlagen'  
      WHEN f.name = 'Geschichte' THEN 'Mittelalter'
      ELSE 'Biologie Basics'
    END as name,
    CASE
      WHEN f.name = 'Deutsch' THEN 'Die wichtigsten deutschen Wörter'
      WHEN f.name = 'Mathematik' THEN 'Grundlagen der Algebra'
      WHEN f.name = 'Geschichte' THEN 'Wichtige Ereignisse im Mittelalter'
      ELSE 'Grundlagen der Biologie'
    END as description,
    f.id as folder_id,
    user_id,
    0 as order_index
  FROM folders f;

  -- Create sample flashcards
  WITH card_sets AS (
    SELECT cs.id, cs.name, f.name as folder_name 
    FROM public.card_sets cs 
    JOIN public.folders f ON cs.folder_id = f.id 
    WHERE cs.user_id = user_id
  )
  INSERT INTO public.flashcards (card_set_id, front_content, back_content, order_index)
  SELECT 
    cs.id,
    CASE 
      WHEN cs.folder_name = 'Deutsch' THEN 
        jsonb_build_object('elements', jsonb_build_array(
          jsonb_build_object(
            'id', 'text-1',
            'type', 'text',
            'content', 'Hallo',
            'position', jsonb_build_object('x', 20, 'y', 20),
            'size', jsonb_build_object('width', 260, 'height', 40),
            'style', jsonb_build_object('fontSize', 18, 'fontWeight', 'bold', 'color', '#000000', 'textAlign', 'center'),
            'zIndex', 1
          )
        ))
      WHEN cs.folder_name = 'Mathematik' THEN
        jsonb_build_object('elements', jsonb_build_array(
          jsonb_build_object(
            'id', 'text-1',
            'type', 'text', 
            'content', '2 + 2 = ?',
            'position', jsonb_build_object('x', 20, 'y', 20),
            'size', jsonb_build_object('width', 260, 'height', 40),
            'style', jsonb_build_object('fontSize', 18, 'fontWeight', 'bold', 'color', '#000000', 'textAlign', 'center'),
            'zIndex', 1
          )
        ))
      ELSE
        jsonb_build_object('elements', jsonb_build_array(
          jsonb_build_object(
            'id', 'text-1',
            'type', 'text',
            'content', 'Wer war Karl der Große?',
            'position', jsonb_build_object('x', 20, 'y', 20),
            'size', jsonb_build_object('width', 260, 'height', 40),
            'style', jsonb_build_object('fontSize', 16, 'fontWeight', 'bold', 'color', '#000000', 'textAlign', 'center'),
            'zIndex', 1
          )
        ))
    END as front_content,
    CASE
      WHEN cs.folder_name = 'Deutsch' THEN
        jsonb_build_object('elements', jsonb_build_array(
          jsonb_build_object(
            'id', 'text-1',
            'type', 'text',
            'content', 'Hello (Englisch)',
            'position', jsonb_build_object('x', 20, 'y', 20),
            'size', jsonb_build_object('width', 260, 'height', 40),
            'style', jsonb_build_object('fontSize', 18, 'fontWeight', 'normal', 'color', '#000000', 'textAlign', 'center'),
            'zIndex', 1
          )
        ))
      WHEN cs.folder_name = 'Mathematik' THEN
        jsonb_build_object('elements', jsonb_build_array(
          jsonb_build_object(
            'id', 'text-1',
            'type', 'text',
            'content', '4',
            'position', jsonb_build_object('x', 20, 'y', 20),
            'size', jsonb_build_object('width', 260, 'height', 40),
            'style', jsonb_build_object('fontSize', 24, 'fontWeight', 'bold', 'color', '#6EE7B7', 'textAlign', 'center'),
            'zIndex', 1
          )
        ))
      ELSE
        jsonb_build_object('elements', jsonb_build_array(
          jsonb_build_object(
            'id', 'text-1',
            'type', 'text',
            'content', 'Kaiser des Heiligen Römischen Reiches (768-814)',
            'position', jsonb_build_object('x', 20, 'y', 20),
            'size', jsonb_build_object('width', 260, 'height', 60),
            'style', jsonb_build_object('fontSize', 14, 'fontWeight', 'normal', 'color', '#000000', 'textAlign', 'center'),
            'zIndex', 1
          )
        ))
    END as back_content,
    0 as order_index
  FROM card_sets cs;

END;
$$ language 'plpgsql';

-- Usage example (uncomment to use):
-- SELECT create_sample_data_for_user('user-uuid-here', 'user@example.com');