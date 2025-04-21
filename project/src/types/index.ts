export type UserRole = 'deaf' | 'mute' | 'blind' | 'hearing' | 'guest';

export type Emotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'neutral' | 'fear' | 'disgust';

export interface Translation {
  text: string;
  emotion?: Emotion;
  timestamp: Date;
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  emotion?: Emotion;
  timestamp: Date;
}

export interface UserSettings {
  role: UserRole;
  language: string;
  textToSpeech: boolean;
  highContrast: boolean;
  largeText: boolean;
  voiceFeedback: boolean;
}