import React, { useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import CameraInput from './components/CameraInput';
import SpeechInput from './components/SpeechInput';
import Chatbot from './components/Chatbot';
import Settings from './components/Settings';

const AppContent: React.FC = () => {
  const { userRole, currentView, settings } = useAppContext();

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Large text
    if (settings.largeText) {
      root.classList.add('text-lg');
    } else {
      root.classList.remove('text-lg');
    }
    
    // High contrast
    if (settings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }
    
    // Dark mode based on system preference (example)
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
      body.classList.add('dark');
    }
    
    // Update document title
    document.title = 'SignVerse - Sign Language Translation';
  }, [settings]);

  // Render different views based on current navigation
  const renderContent = () => {
    // If no role is selected, show landing page
    if (!userRole) {
      return <LandingPage />;
    }
    
    // Role is selected, show appropriate view
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'sign':
        return (
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Sign Language Input</h1>
            <CameraInput />
          </div>
        );
      case 'speech':
        return (
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Speech Input</h1>
            <SpeechInput />
          </div>
        );
      case 'chat':
        return (
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">SignVerse Assistant</h1>
            <Chatbot />
          </div>
        );
      case 'settings':
        return (
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h1>
            <Settings />
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <main className={`pt-16 pb-16 md:pb-0 min-h-screen ${!userRole ? 'pt-0' : ''}`}>
        {renderContent()}
      </main>
      <BottomNav />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;