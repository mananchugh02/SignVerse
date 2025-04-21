import React, { useRef, useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Camera, X, Loader2 } from 'lucide-react';
import EmotionIndicator from './EmotionIndicator';
import { Emotion } from '../types';

const CameraInput: React.FC = () => {
  const {
    isTranslating,
    setIsTranslating,
    addTranslation,
    currentEmotion,
    setCurrentEmotion,
  } = useAppContext();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultsText, setResultsText] = useState('');
  const [resultsEmotion, setResultsEmotion] = useState('')

  // Call backend to start processing (no camera access)
  const startCamera = async () => {
    console.log('[CameraInput] Enable Camera clicked – initializing backend only...');
    try {
      const response = await fetch('http://localhost:5000/vtot');
      console.log('[CameraInput] Backend /vtot response:', response.status);

      if (!response.ok) {
        const text = await response.text();
        console.warn('[CameraInput] Backend returned non-OK response:', text);
        throw new Error('Backend initialization failed');
      }

      // setCameraActive(false);
    } catch (err: any) {
      console.error('[CameraInput] Error calling backend:', err);
      alert(`Failed to initialize camera backend. ${err.message}`);
    }
  };

  const fetchResult = async () => {
    try {
      const response = await fetch('http://localhost:5000/vtot/results');
      const data = await response.json();

      console.log('[CameraInput] Polled /vtot/results:', data);

      
      if (data.detected_signs) {
        setResultsText(data.detected_signs);
      }
      
      if (data.dominant_emotion) {
        setResultsEmotion(data.dominant_emotion);
      }
      
      // return data;
    } catch (err) {
      console.error('[CameraInput] Polling error:', err);
    }
  }

  const stopCamera = () => {
    console.log('[CameraInput] Stopping camera...');
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCurrentEmotion(null);
  };

  const toggleTranslation = () => {
    setIsTranslating(!isTranslating);
    if (!isTranslating) {
      setTranslatedText('');
    }
  };

 
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (cameraActive && isTranslating) {
      interval = setInterval(async () => {
        try {
          const response = await fetch('http://localhost:5000/vtot/results');
          const data = await response.json();

          console.log('[CameraInput] Polled /vtot/results:', data);

          if (data.detected_signs) {
            setTranslatedText(data.detected_signs);
          }

          if (data.dominant_emotion) {
            setCurrentEmotion(data.dominant_emotion);
          }

        } catch (err) {
          console.error('[CameraInput] Polling error:', err);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [cameraActive, isTranslating]);

  return (
    <div className="w-full">
      <div className="mb-4 relative overflow-hidden bg-black rounded-xl aspect-video max-w-2xl mx-auto">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900 bg-opacity-80">
            <Camera size={48} className="mb-2" />
            <p>Camera access required</p>
            <button
              onClick={startCamera}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
            >
              Enable Camera
            </button>
          </div>
        )}


        

        {cameraActive && (
          <>
            {currentEmotion && (
              <div className="absolute top-4 right-4">
                <EmotionIndicator
                  emotion={currentEmotion as Emotion}
                  showTooltip
                  size="md"
                />
              </div>
            )}
            <button
              onClick={stopCamera}
              className="absolute top-4 left-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none transition-colors"
              aria-label="Stop camera"
            >
              <X size={20} />
            </button>
          </>
        )}
      </div>

      <div className="flex justify-center gap-4 mb-6">
        {/* <button
          onClick={toggleTranslation}
          disabled={!cameraActive || isLoading}
          className={`px-6 py-3 rounded-lg font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            isTranslating ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isTranslating ? 'Stop' : 'Start Signing'}
        </button> */}
        
        <button
              onClick={fetchResult}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
            >
              Fetch Result
            </button>
          {resultsEmotion && (
            <div className="flex flex-col text-center text-white bg-indigo-600 bg-opacity-80 mt-4 px-4 py-2 rounded-md">
            <p>Emotion: {resultsEmotion}</p>
            <p>Text: {resultsText}</p>
            </div>
          )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mr-2" />
          <p>Translating...</p>
        </div>
      )}

      {translatedText && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-2">Translation</h3>
          <p className="text-gray-700 dark:text-gray-300">{translatedText}</p>

          {currentEmotion && (
            <div className="mt-3 flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                Detected emotion:
              </span>
              <EmotionIndicator emotion={currentEmotion as Emotion} size="sm" />
            </div>
          )}

          <div className="mt-4">
            <button className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
              Play as speech
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraInput;