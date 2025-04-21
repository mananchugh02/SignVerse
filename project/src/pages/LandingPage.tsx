import React from 'react';
import { useAppContext } from '../context/AppContext';
import RoleCard from '../components/RoleCard';
import { HandMetal, Volume2 } from 'lucide-react';
import { useSpeechSynthesis } from 'react-speech-kit';

const LandingPage: React.FC = () => {
  const { setUserRole, setCurrentView } = useAppContext();
  const { speak, voices } = useSpeechSynthesis();

  const handleRoleSelect = (role: typeof userRoles[number]['value']) => {
    setUserRole(role);
    
    // Redirect to different views based on role
    switch (role) {
      case 'deaf':
      case 'mute':
        setCurrentView('sign');
        break;
      case 'blind':
      case 'hearing':
        setCurrentView('speech');
        break;
      default:
        setCurrentView('home');
    }
  };

  const userRoles = [
    {
      value: 'deaf',
      title: 'Deaf',
      description: 'Communicate using sign language and receive written responses',
    },
    {
      value: 'mute',
      title: 'Mute',
      description: 'Use sign language to communicate with verbal, non-signing individuals',
    },
    {
      value: 'blind',
      title: 'Blind',
      description: 'Speak and receive audio responses with emotional context',
    },
    {
      value: 'hearing',
      title: 'Hearing',
      description: 'Communicate with sign language users through text or speech',
    },
    {
      value: 'guest',
      title: 'Guest',
      description: 'Explore the platform and learn about sign language communication',
    },
  ];

  const speakText = () => {
    const text = `Who are you? Please select your role: ${userRoles.map(role => role.title).join(', ')}`;
    speak({ text, voice: voices[0] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
              <HandMetal className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Welcome to <span className="text-indigo-600 dark:text-indigo-400">SignVerse</span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Breaking communication barriers with AI-powered sign language translation
          </p>
        </div>

        <div className="mb-12 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
              Who are you?
            </h2>
            <button
              onClick={speakText}
              className="p-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              aria-label="Listen to options"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRoles.map((role) => (
              <RoleCard
                key={role.value}
                role={role.value as any}
                title={role.title}
                description={role.description}
                onSelect={handleRoleSelect}
              />
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            About SignVerse
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            SignVerse is an AI-powered sign language translation system that enables accessible, 
            inclusive, and natural interaction for all users, whether deaf or hearing. 
            Our platform translates continuous sign gestures into full sentences while including 
            facial expressions to capture context and emotion.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <FeatureCard
              title="Complete Translation"
              description="Captures both gestures and facial expressions for accurate meaning"
            />
            <FeatureCard
              title="Emotional Context"
              description="Preserves emotional nuance in translations for natural communication"
            />
            <FeatureCard
              title="Multilingual Support"
              description="Communicate across various spoken languages seamlessly"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
      <h3 className="text-lg font-medium mb-2 text-indigo-800 dark:text-indigo-300">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default LandingPage;