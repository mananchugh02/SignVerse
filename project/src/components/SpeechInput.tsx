import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Mic, MicOff, Loader2 } from 'lucide-react';

const SpeechInput: React.FC = () => {
  const { addTranslation } = useAppContext();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const startFakeRecording = async () => {
    console.log('[SpeechInput] Sending "start" to backend (no mic access)...');
    setIsRecording(true);

    try {
      const response = await fetch('http://localhost:5000/stot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'start' }),
      });

      console.log('[SpeechInput] Start response status:', response.status);
      if (!response.ok) {
        const text = await response.text();
        console.warn('[SpeechInput] Start error response:', text);
        throw new Error('Failed to start backend session');
      }

      console.log('[SpeechInput] Backend recording session started.');
    } catch (error) {
      console.error('[SpeechInput] Error starting session:', error);
      setIsRecording(false);
      alert('Failed to start session. Please try again.');
    }
  };

  const stopFakeRecording = async () => {
    console.log('[SpeechInput] Sending "stop" to backend...');
    setIsRecording(false);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/stot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'stop' }),
      });

      console.log('[SpeechInput] Stop response status:', response.status);

      if (!response.ok) {
        const text = await response.text();
        console.warn('[SpeechInput] Stop error response:', text);
        throw new Error('Failed to fetch transcription');
      }

      const data = await response.json();
      console.log('[SpeechInput] Transcription result:', data);

      setTranscription(data.text);
      addTranslation({
        text: data.text,
        emotion: 'neutral',
        timestamp: new Date(),
      });

    } catch (error) {
      console.error('[SpeechInput] Error during transcription:', error);
      alert('Failed to get transcription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopFakeRecording();
    } else {
      startFakeRecording();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-6 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors mb-4 ${
            isRecording
              ? 'bg-red-100 dark:bg-red-900/30'
              : 'bg-indigo-100 dark:bg-indigo-900/30'
          }`}
        >
          <button
            onClick={handleToggleRecording}
            disabled={isLoading}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all focus:outline-none disabled:opacity-50 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
            aria-label={isRecording ? 'Stop session' : 'Start session'}
          >
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
        </div>

        <p className="text-center text-gray-700 dark:text-gray-300">
          {isLoading
            ? 'Processing speech...'
            : isRecording
            ? 'Simulating listening... Click to stop'
            : 'Click to start speaking (no real mic used)'}
        </p>
      </div>

      {transcription && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-2">Transcription</h3>
          <p className="text-gray-700 dark:text-gray-300">{transcription}</p>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Instructions</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>This version does not access your microphone</li>
          <li>Click "Start" to simulate a speech session</li>
          <li>The backend will handle processing without mic input</li>
          <li>Click "Stop" to fetch and display the transcription</li>
        </ul>
      </div>
    </div>
  );
};

export default SpeechInput;