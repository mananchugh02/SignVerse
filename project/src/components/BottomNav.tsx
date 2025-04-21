import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Home, Settings, MessageSquare, HandMetal, Mic } from 'lucide-react';

const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, userRole } = useAppContext();

  // Hide bottom nav on landing page
  if (!userRole) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-top z-10">
      <div className="flex justify-around items-center h-16">
        <NavButton
          icon={<Home />}
          label="Home"
          isActive={currentView === 'home'}
          onClick={() => setCurrentView('home')}
        />
        <NavButton
          icon={<HandMetal />}
          label="Sign"
          isActive={currentView === 'sign'}
          onClick={() => setCurrentView('sign')}
        />
        <NavButton
          icon={<Mic />}
          label="Speech"
          isActive={currentView === 'speech'}
          onClick={() => setCurrentView('speech')}
        />
        <NavButton
          icon={<MessageSquare />}
          label="Chat"
          isActive={currentView === 'chat'}
          onClick={() => setCurrentView('chat')}
        />
        <NavButton
          icon={<Settings />}
          label="Settings"
          isActive={currentView === 'settings'}
          onClick={() => setCurrentView('settings')}
        />
      </div>
    </div>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-1/5 py-1 ${
        isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
      }`}
    >
      <div className="w-6 h-6">{icon}</div>
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export default BottomNav;