import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserSettings, Translation, Message } from '../types';

interface AppContextType {
  userRole: UserRole | null;
  setUserRole: (role: UserRole) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  translations: Translation[];
  addTranslation: (translation: Translation) => void;
  messages: Message[];
  addMessage: (message: Message) => void;
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  isTranslating: boolean;
  setIsTranslating: (isTranslating: boolean) => void;
  currentEmotion: string | null;
  setCurrentEmotion: (emotion: string | null) => void;
}

const defaultSettings: UserSettings = {
  role: 'guest',
  language: 'en',
  textToSpeech: true,
  highContrast: false,
  largeText: false,
  voiceFeedback: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentView, setCurrentView] = useState<string>('home');
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);

  // Load settings from localStorage if available
  useEffect(() => {
    const savedSettings = localStorage.getItem('signverse-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('signverse-settings', JSON.stringify(settings));
  }, [settings]);

  // Update user role in settings when it changes
  useEffect(() => {
    if (userRole) {
      updateSettings({ role: userRole });
    }
  }, [userRole]);

  const addTranslation = (translation: Translation) => {
    setTranslations((prev) => [translation, ...prev]);
  };

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentView,
        setCurrentView,
        translations,
        addTranslation,
        messages,
        addMessage,
        settings,
        updateSettings,
        isTranslating,
        setIsTranslating,
        currentEmotion,
        setCurrentEmotion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};