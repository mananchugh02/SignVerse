import React from 'react';
import { useAppContext } from '../context/AppContext';
import { HandMetal, Mic, MessageSquare, Settings } from 'lucide-react';

const HomePage: React.FC = () => {
  const { setCurrentView, translations } = useAppContext();

  // Display recent translations, if any
  const recentTranslations = translations.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Welcome to <span className="text-indigo-600 dark:text-indigo-400">SignVerse</span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Choose an action to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <FeatureCard
          icon={<HandMetal className="w-8 h-8 text-indigo-600" />}
          title="Sign Language Input"
          description="Use sign language to communicate through our AI-powered translation system"
          action={() => setCurrentView('sign')}
          actionLabel="Start Signing"
        />
        
        <FeatureCard
          icon={<Mic className="w-8 h-8 text-indigo-600" />}
          title="Speech Input"
          description="Speak to communicate with sign language users through text translation"
          action={() => setCurrentView('speech')}
          actionLabel="Start Speaking"
        />
        
        <FeatureCard
          icon={<MessageSquare className="w-8 h-8 text-indigo-600" />}
          title="Chat Assistant"
          description="Get help or practice communication with our AI-powered assistant"
          action={() => setCurrentView('chat')}
          actionLabel="Open Chat"
        />
      </div>

      {recentTranslations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Translations</h2>
            <button 
              onClick={() => {}} 
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentTranslations.map((translation, index) => (
              <div key={index} className="p-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <p className="text-gray-800 dark:text-gray-200">{translation.text}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(translation.timestamp).toLocaleString()}
                  </span>
                  {translation.emotion && (
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 capitalize">
                      {translation.emotion}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 border border-indigo-100 dark:border-indigo-900/50">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">How to Use SignVerse</h2>
        
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-medium">1. Choose your input method</span> - Use either sign language or speech
            based on your communication needs.
          </p>
          <p>
            <span className="font-medium">2. Start a conversation</span> - Our AI will translate your input and detect emotions
            to provide context-aware translations.
          </p>
          <p>
            <span className="font-medium">3. Customize your experience</span> - Visit the{' '}
            <button 
              onClick={() => setCurrentView('settings')}
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
            >
              Settings
            </button>{' '}
            to adjust accessibility options and preferences.
          </p>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: () => void;
  actionLabel: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, action, actionLabel }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 inline-block rounded-lg">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{description}</p>
        <button
          onClick={action}
          className="mt-auto w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export default HomePage;