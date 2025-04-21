import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Info } from 'lucide-react';
import { Emotion } from '../types';

const emotionMap: Record<Emotion, { emoji: string; color: string }> = {
  happy: { emoji: '😊', color: 'bg-green-100 text-green-800 border-green-200' },
  sad: { emoji: '😢', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  angry: { emoji: '😠', color: 'bg-red-100 text-red-800 border-red-200' },
  surprised: { emoji: '😲', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  neutral: { emoji: '😐', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  fear: { emoji: '😨', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  disgust: { emoji: '🤢', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
};

interface EmotionIndicatorProps {
  emotion?: Emotion;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTooltip?: boolean;
}

const EmotionIndicator: React.FC<EmotionIndicatorProps> = ({ 
  emotion = 'neutral', 
  size = 'md', 
  showLabel = true,
  showTooltip = false
}) => {
  const [showInfo, setShowInfo] = React.useState(false);
  const { emoji, color } = emotionMap[emotion as Emotion] || emotionMap.neutral;
  
  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-1.5 px-3',
    lg: 'text-lg py-2 px-4'
  };

  return (
    <div className="relative inline-flex items-center">
      <div className={`rounded-full ${color} ${sizeClasses[size]} border flex items-center`}>
        <span className="mr-1">{emoji}</span>
        {showLabel && <span className="capitalize">{emotion}</span>}
        
        {showTooltip && (
          <button 
            className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setShowInfo(!showInfo)}
            aria-label="Emotion information"
          >
            <Info size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />
          </button>
        )}
      </div>
      
      {showInfo && showTooltip && (
        <div className="absolute bottom-full mb-2 p-2 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700 text-sm w-60 z-10">
          <p>Emotion affects how the message is interpreted. This helps capture the full context of communication.</p>
        </div>
      )}
    </div>
  );
};

export default EmotionIndicator;