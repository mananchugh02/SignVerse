import React from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { EarOff, Mic, Eye, Ear, User } from 'lucide-react';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useAppContext();
  
  const roleOptions: { value: UserRole; label: string; icon: React.ReactNode }[] = [
    { value: 'deaf', label: 'Deaf', icon: <EarOff className="w-5 h-5" /> },
    { value: 'mute', label: 'Mute', icon: <Mic className="w-5 h-5" /> },
    { value: 'blind', label: 'Blind', icon: <Eye className="w-5 h-5" /> },
    { value: 'hearing', label: 'Hearing', icon: <Ear className="w-5 h-5" /> },
    { value: 'guest', label: 'Guest', icon: <User className="w-5 h-5" /> },
  ];
  
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' },
  ];
  
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h2>
      
      <div className="space-y-6">
        {/* Role Selection */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Your Role</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {roleOptions.map((role) => (
              <div
                key={role.value}
                onClick={() => updateSettings({ role: role.value })}
                className={`p-3 rounded-lg cursor-pointer flex items-center border ${
                  settings.role === role.value
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className={`p-2 rounded-full mr-3 ${
                  settings.role === role.value
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {role.icon}
                </div>
                <span className={`${
                  settings.role === role.value
                    ? 'text-indigo-700 dark:text-indigo-300 font-medium'
                    : 'text-gray-800 dark:text-gray-300'
                }`}>{role.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Language
          </label>
          <select
            id="language"
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value })}
            className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Accessibility Options */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Accessibility</h3>
          
          <div className="space-y-3">
            <ToggleOption
              id="textToSpeech"
              label="Text to Speech"
              description="Read translations aloud automatically"
              isChecked={settings.textToSpeech}
              onChange={() => updateSettings({ textToSpeech: !settings.textToSpeech })}
            />
            
            <ToggleOption
              id="highContrast"
              label="High Contrast"
              description="Increase contrast for better visibility"
              isChecked={settings.highContrast}
              onChange={() => updateSettings({ highContrast: !settings.highContrast })}
            />
            
            <ToggleOption
              id="largeText"
              label="Large Text"
              description="Increase text size throughout the app"
              isChecked={settings.largeText}
              onChange={() => updateSettings({ largeText: !settings.largeText })}
            />
            
            <ToggleOption
              id="voiceFeedback"
              label="Voice Feedback"
              description="Speak interface actions (for blind users)"
              isChecked={settings.voiceFeedback}
              onChange={() => updateSettings({ voiceFeedback: !settings.voiceFeedback })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ToggleOptionProps {
  id: string;
  label: string;
  description: string;
  isChecked: boolean;
  onChange: () => void;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({ id, label, description, isChecked, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <label htmlFor={id} className="font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          id={id}
          onClick={onChange}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isChecked ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}
          role="switch"
          aria-checked={isChecked}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isChecked ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default Settings;