import React from 'react';
import { UserRole } from '../types';
import { EarOff, Mic, Eye, Ear, User } from 'lucide-react';

interface RoleCardProps {
  role: UserRole;
  title: string;
  description: string;
  onSelect: (role: UserRole) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, title, description, onSelect }) => {
  const getIcon = (role: UserRole) => {
    switch (role) {
      case 'deaf':
        return <EarOff className="w-8 h-8 text-indigo-600" />;
      case 'mute':
        return <Mic className="w-8 h-8 text-indigo-600" />;
      case 'blind':
        return <Eye className="w-8 h-8 text-indigo-600" />;
      case 'hearing':
        return <Ear className="w-8 h-8 text-indigo-600" />;
      case 'guest':
        return <User className="w-8 h-8 text-indigo-600" />;
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700"
      onClick={() => onSelect(role)}
    >
      <div className="flex items-start mb-4">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg mr-4">
          {getIcon(role)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{description}</p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(role);
        }}
        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        Select
      </button>
    </div>
  );
};

export default RoleCard;