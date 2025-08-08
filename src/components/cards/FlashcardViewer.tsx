import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { CardContent as CardContentType, Flashcard } from '@/types';
import { 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Shuffle,
  Eye,
  EyeOff
} from 'lucide-react';

interface FlashcardViewerProps {
  cards: Flashcard[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onAnswer?: (correct: boolean) => void;
  showAnswers?: boolean;
  shuffled?: boolean;
  onShuffle?: () => void;
}

interface CardSideProps {
  content: CardContentType[];
  side: 'front' | 'back';
}

export default function FlashcardViewer({
  cards,
  currentIndex,
  onIndexChange,
  onAnswer,
  showAnswers = false,
  shuffled = false,
  onShuffle
}: FlashcardViewerProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoFlip, setAutoFlip] = useState(false);
  const { t } = useTranslation('study');

  const currentCard = cards[currentIndex];
  
  if (!currentCard) return null;

  const frontContent = Array.isArray(currentCard.front_content) 
    ? currentCard.front_content as unknown as CardContentType[]
    : (currentCard.front_content as any)?.elements || [];
    
  const backContent = Array.isArray(currentCard.back_content)
    ? currentCard.back_content as unknown as CardContentType[]
    : (currentCard.back_content as any)?.elements || [];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      onIndexChange(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault();
        handleFlip();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handlePrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleNext();
        break;
    }
  };

  const handleAnswer = (correct: boolean) => {
    onAnswer?.(correct);
    handleNext();
  };

  return (
    <div 
      className="flex flex-col items-center space-y-6 max-w-2xl mx-auto"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Card counter and controls */}
      <div className="flex items-center justify-between w-full">
        <div className="text-sm text-muted-foreground">
          {t('study:cardCount', { current: currentIndex + 1, total: cards.length })}
        </div>
        
        <div className="flex items-center space-x-2">
          {onShuffle && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={onShuffle}
              className={shuffled ? 'bg-accent' : ''}
            >
              <Shuffle className="h-4 w-4 mr-1" />
              {t('study:shuffle')}
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setAutoFlip(!autoFlip)}
          >
            {autoFlip ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative w-full max-w-md h-80 perspective-1000">
        <motion.div
          className="relative w-full h-full cursor-pointer transform-style-preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          onClick={handleFlip}
        >
          {/* Front Side */}
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden"
            initial={false}
          >
            <div className="w-full h-full bg-white rounded-lg border-2 border-border shadow-lg overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="flex-1 p-6 overflow-hidden">
                  <CardSide content={frontContent} side="front" />
                </div>
                <div className="px-4 py-2 bg-muted/50 text-center">
                  <span className="text-sm text-muted-foreground">
                    {t('study:clickToFlip')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Back Side */}
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden rotate-y-180"
            initial={false}
          >
            <div className="w-full h-full bg-white rounded-lg border-2 border-primary shadow-lg overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="flex-1 p-6 overflow-hidden">
                  <CardSide content={backContent} side="back" />
                </div>
                <div className="px-4 py-2 bg-primary/10 text-center">
                  <span className="text-sm text-primary font-medium">
                    {t('study:answer')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Answer buttons (when flipped and in study mode) */}
      <AnimatePresence>
        {isFlipped && onAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-center space-x-4"
          >
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleAnswer(false)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              {t('study:incorrect')}
            </Button>
            
            <Button
              size="lg"
              onClick={() => handleAnswer(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {t('study:correct')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between w-full">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t('study:previous')}
        </Button>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFlip}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            {t('study:flip')}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          {t('study:next')}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-xs text-muted-foreground text-center">
        <div>{t('study:shortcuts.space')} • {t('study:shortcuts.arrows')}</div>
      </div>
    </div>
  );
}

function CardSide({ content, side }: CardSideProps) {
  if (!content || content.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="text-lg mb-1">
            {side === 'front' ? 'Front side' : 'Back side'}
          </div>
          <div className="text-sm">No content</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {content
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
        .map((element) => (
          <div
            key={element.id}
            className="absolute"
            style={{
              left: `${(element.position.x / 300) * 100}%`,
              top: `${(element.position.y / 200) * 100}%`,
              width: `${(element.size.width / 300) * 100}%`,
              height: `${(element.size.height / 200) * 100}%`,
              transform: `rotate(${element.rotation || 0}deg)`,
              zIndex: element.zIndex,
            }}
          >
            {element.type === 'text' ? (
              <div
                className="h-full w-full flex items-center justify-center p-1 whitespace-pre-wrap break-words"
                style={{
                  fontSize: `${((element.style?.fontSize || 16) / 300) * 100}%`,
                  fontWeight: element.style?.fontWeight || 'normal',
                  fontStyle: element.style?.fontStyle || 'normal',
                  color: element.style?.color || '#000000',
                  textAlign: element.style?.textAlign || 'left',
                  backgroundColor: element.style?.backgroundColor,
                }}
              >
                {element.content}
              </div>
            ) : (
              <img
                src={element.content}
                alt=""
                className="w-full h-full object-contain rounded"
                draggable={false}
              />
            )}
          </div>
        ))}
    </div>
  );
}