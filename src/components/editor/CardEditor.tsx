import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';

import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CardContent, StudyCardColor } from '@/types';
import { STUDY_CARD_COLORS, DEFAULT_TEXT_STYLE } from '@/constants';
import { 
  Type, 
  Image as ImageIcon, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  RotateCcw,
  Move,
  Trash2,
  Plus,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface CardEditorProps {
  content: CardContent[];
  onChange: (content: CardContent[]) => void;
  side: 'front' | 'back';
  readonly?: boolean;
}

interface TextElementProps {
  element: CardContent;
  onUpdate: (updates: Partial<CardContent>) => void;
  onDelete: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

interface ImageElementProps extends TextElementProps {}

export default function CardEditor({ content, onChange, side, readonly = false }: CardEditorProps) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('editor');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const addTextElement = () => {
    const newElement: CardContent = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: t('editor:newText'),
      position: { x: 50, y: 50 },
      size: { width: 200, height: 40 },
      rotation: 0,
      zIndex: content.length,
      style: { ...DEFAULT_TEXT_STYLE }
    };

    onChange([...content, newElement]);
    setSelectedElement(newElement.id);
  };

  const addImageElement = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('editor:imageTooLarge'));
        return;
      }

      try {
        // TODO: Upload to Supabase Storage
        const imageUrl = URL.createObjectURL(file); // Temporary for demo
        
        const newElement: CardContent = {
          id: `image-${Date.now()}`,
          type: 'image',
          content: imageUrl,
          position: { x: 50, y: 50 },
          size: { width: 150, height: 100 },
          rotation: 0,
          zIndex: content.length
        };

        onChange([...content, newElement]);
        setSelectedElement(newElement.id);
        toast.success(t('editor:imageAdded'));
      } catch (error) {
        toast.error(t('editor:imageError'));
      }
    };
    input.click();
  };

  const updateElement = (id: string, updates: Partial<CardContent>) => {
    const updatedContent = content.map(element =>
      element.id === id ? { ...element, ...updates } : element
    );
    onChange(updatedContent);
  };

  const deleteElement = (id: string) => {
    const updatedContent = content.filter(element => element.id !== id);
    onChange(updatedContent);
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setDraggedElement(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    setDraggedElement(null);

    if (delta.x === 0 && delta.y === 0) return;

    const element = content.find(el => el.id === active.id);
    if (!element) return;

    updateElement(element.id, {
      position: {
        x: Math.max(0, element.position.x + delta.x),
        y: Math.max(0, element.position.y + delta.y)
      }
    });
  };

  const selectedElementData = content.find(el => el.id === selectedElement);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      {!readonly && (
        <div className="border-b bg-card p-3 space-y-2">
          {/* Main Tools */}
          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={addTextElement}>
              <Type className="h-4 w-4 mr-1" />
              {t('editor:addText')}
            </Button>
            
            <Button size="sm" variant="outline" onClick={addImageElement}>
              <ImageIcon className="h-4 w-4 mr-1" />
              {t('editor:addImage')}
            </Button>

            <div className="border-l pl-2 ml-2 flex items-center space-x-1">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setZoom(Math.max(25, zoom - 25))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-muted-foreground px-2">
                {zoom}%
              </span>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Element-specific tools */}
          {selectedElementData && selectedElementData.type === 'text' && (
            <div className="flex items-center space-x-2 pt-2 border-t">
              <Button
                size="sm"
                variant={selectedElementData.style?.fontWeight === 'bold' ? 'default' : 'outline'}
                onClick={() => updateElement(selectedElementData.id, {
                  style: { 
                    ...selectedElementData.style,
                    fontWeight: selectedElementData.style?.fontWeight === 'bold' ? 'normal' : 'bold'
                  }
                })}
              >
                <Bold className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant={selectedElementData.style?.fontStyle === 'italic' ? 'default' : 'outline'}
                onClick={() => updateElement(selectedElementData.id, {
                  style: { 
                    ...selectedElementData.style,
                    fontStyle: selectedElementData.style?.fontStyle === 'italic' ? 'normal' : 'italic'
                  }
                })}
              >
                <Italic className="h-4 w-4" />
              </Button>

              <div className="border-l pl-2 ml-2 flex items-center space-x-1">
                <Button
                  size="sm"
                  variant={selectedElementData.style?.textAlign === 'left' ? 'default' : 'outline'}
                  onClick={() => updateElement(selectedElementData.id, {
                    style: { ...selectedElementData.style, textAlign: 'left' }
                  })}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant={selectedElementData.style?.textAlign === 'center' ? 'default' : 'outline'}
                  onClick={() => updateElement(selectedElementData.id, {
                    style: { ...selectedElementData.style, textAlign: 'center' }
                  })}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant={selectedElementData.style?.textAlign === 'right' ? 'default' : 'outline'}
                  onClick={() => updateElement(selectedElementData.id, {
                    style: { ...selectedElementData.style, textAlign: 'right' }
                  })}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="border-l pl-2 ml-2">
                <input
                  type="color"
                  value={selectedElementData.style?.color || '#000000'}
                  onChange={(e) => updateElement(selectedElementData.id, {
                    style: { ...selectedElementData.style, color: e.target.value }
                  })}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 bg-muted/20 p-4 overflow-auto">
        <div 
          ref={canvasRef}
          className="relative bg-white rounded-lg shadow-sm mx-auto"
          style={{ 
            width: `${300 * (zoom / 100)}px`,
            height: `${200 * (zoom / 100)}px`,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center center'
          }}
          onClick={() => setSelectedElement(null)}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={content.map(el => el.id)} strategy={rectSortingStrategy}>
              {content
                .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                .map((element) => (
                  element.type === 'text' ? (
                    <TextElement
                      key={element.id}
                      element={element}
                      onUpdate={(updates) => updateElement(element.id, updates)}
                      onDelete={() => deleteElement(element.id)}
                      isSelected={selectedElement === element.id}
                      onSelect={() => setSelectedElement(element.id)}
                    />
                  ) : (
                    <ImageElement
                      key={element.id}
                      element={element}
                      onUpdate={(updates) => updateElement(element.id, updates)}
                      onDelete={() => deleteElement(element.id)}
                      isSelected={selectedElement === element.id}
                      onSelect={() => setSelectedElement(element.id)}
                    />
                  )
                ))}
            </SortableContext>
          </DndContext>

          {/* Empty state */}
          {content.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="text-lg mb-2">{t('editor:emptyCard')}</div>
                <div className="text-sm">{t('editor:emptyCardDesc')}</div>
              </div>
            </div>
          )}
        </div>

        {/* Side indicator */}
        <div className="text-center mt-4">
          <span className="text-sm text-muted-foreground bg-card px-3 py-1 rounded-full">
            {side === 'front' ? t('editor:frontSide') : t('editor:backSide')}
          </span>
        </div>
      </div>
    </div>
  );
}

function TextElement({ element, onUpdate, onDelete, isSelected, onSelect }: TextElementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(element.content);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSubmit = () => {
    onUpdate({ content: editValue });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditValue(element.content);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        transform: `rotate(${element.rotation || 0}deg)`,
        zIndex: element.zIndex,
      }}
      className={cn(
        'group cursor-pointer',
        isSelected && 'ring-2 ring-primary ring-offset-1',
        isDragging && 'opacity-50'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={handleDoubleClick}
      {...attributes}
      {...listeners}
    >
      {isEditing ? (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="w-full h-full resize-none border-none bg-transparent outline-none"
          style={{
            fontSize: element.style?.fontSize || 16,
            fontWeight: element.style?.fontWeight || 'normal',
            fontStyle: element.style?.fontStyle || 'normal',
            color: element.style?.color || '#000000',
            textAlign: element.style?.textAlign || 'left',
          }}
          autoFocus
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center p-2 whitespace-pre-wrap break-words"
          style={{
            fontSize: element.style?.fontSize || 16,
            fontWeight: element.style?.fontWeight || 'normal',
            fontStyle: element.style?.fontStyle || 'normal',
            color: element.style?.color || '#000000',
            textAlign: element.style?.textAlign || 'left',
            backgroundColor: element.style?.backgroundColor,
          }}
        >
          {element.content}
        </div>
      )}

      {/* Selection handles */}
      {isSelected && !isEditing && (
        <div className="absolute -top-1 -right-1">
          <Button
            size="sm"
            variant="destructive"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

function ImageElement({ element, onUpdate, onDelete, isSelected, onSelect }: ImageElementProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        transform: `rotate(${element.rotation || 0}deg)`,
        zIndex: element.zIndex,
      }}
      className={cn(
        'group cursor-pointer',
        isSelected && 'ring-2 ring-primary ring-offset-1',
        isDragging && 'opacity-50'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      {...attributes}
      {...listeners}
    >
      <img
        src={element.content}
        alt=""
        className="w-full h-full object-contain rounded"
        draggable={false}
      />

      {/* Selection handles */}
      {isSelected && (
        <div className="absolute -top-1 -right-1">
          <Button
            size="sm"
            variant="destructive"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}