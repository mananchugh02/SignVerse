import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Home, Settings, MessageSquare, HandMetal, Mic } from 'lucide-react';

const Header: React.FC = () => {
  const { currentView, setCurrentView, userRole } = useAppContext();

  // Hide header on landing page
  if (!userRole) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md dark:bg-gray-900 dark:text-white transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <HandMetal className="w-8 h-8 text-indigo-500" />
          <h1 className="text-xl font-bold">SignVerse</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <NavItem icon={<Home />} text="Home" view="home" currentView={currentView} setCurrentView={setCurrentView} />
          <NavItem icon={<HandMetal />} text="Sign Input" view="sign" currentView={currentView} setCurrentView={setCurrentView} />
          <NavItem icon={<Mic />} text="Speech Input" view="speech" currentView={currentView} setCurrentView={setCurrentView} />
          <NavItem icon={<MessageSquare />} text="Chatbot" view="chat" currentView={currentView} setCurrentView={setCurrentView} />
          <NavItem icon={<Settings />} text="Settings" view="settings" currentView={currentView} setCurrentView={setCurrentView} />
        </nav>

        <div className="md:hidden">
          <MobileMenu currentView={currentView} setCurrentView={setCurrentView} />
        </div>
      </div>
    </header>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  view: string;
  currentView: string;
  setCurrentView: (view: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, view, currentView, setCurrentView }) => {
  const isActive = currentView === view;
  
  return (
    <button
      onClick={() => {
        // alert(view)
        if(view === 'chat'){
          // return;
          window.open("http://localhost:8501/", "_blank");  
          return;

        }
        setCurrentView(view)
      }}
      className={`flex items-center space-x-1 py-2 px-3 rounded-lg transition-colors ${
        isActive 
          ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/30' 
          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30'
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{text}</span>
    </button>
  );
};

const MobileMenu: React.FC<{ currentView: string; setCurrentView: (view: string) => void }> = ({ 
  currentView, 
  setCurrentView 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleNavigation = (view: string) => {
    setCurrentView(view);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 dark:text-gray-300 focus:outline-none"
      >
        <div className="w-6 h-0.5 bg-current mb-1.5"></div>
        <div className="w-6 h-0.5 bg-current mb-1.5"></div>
        <div className="w-6 h-0.5 bg-current"></div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl dark:bg-gray-800 z-20">
          <div className="flex flex-col gap-1 p-1">
            <MobileNavItem icon={<Home />} text="Home" view="home" currentView={currentView} onClick={() => handleNavigation('home')} />
            <MobileNavItem icon={<HandMetal />} text="Sign Input" view="sign" currentView={currentView} onClick={() => handleNavigation('sign')} />
            <MobileNavItem icon={<Mic />} text="Speech Input" view="speech" currentView={currentView} onClick={() => handleNavigation('speech')} />
            <MobileNavItem icon={<MessageSquare />} text="Chatbot" view="chat" currentView={currentView} onClick={() => handleNavigation('chat')} />
            <MobileNavItem icon={<Settings />} text="Settings" view="settings" currentView={currentView} onClick={() => handleNavigation('settings')} />
          </div>
        </div>
      )}
    </div>
  );
};

interface MobileNavItemProps {
  icon: React.ReactNode;
  text: string;
  view: string;
  currentView: string;
  onClick: () => void;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ icon, text, view, currentView, onClick }) => {
  const isActive = currentView === view;
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 py-2 px-4 w-full text-left rounded-md ${
        isActive 
          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{text}</span>
    </button>
  );
};

export default Header;