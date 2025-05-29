// src/lib/hooks/useVoiceSearch.js

import { useEffect, useState } from 'react';
import mockSpeechRecognition, { mockUseSpeechRecognition } from './mockSpeechRecognition';

// Try to import real speech recognition, fall back to mock if it fails
let SpeechRecognition, useSpeechRecognition;
try {
  // Try to dynamically import the real speech recognition
  const realSpeechModule = require('react-speech-recognition');
  SpeechRecognition = realSpeechModule.default;
  useSpeechRecognition = realSpeechModule.useSpeechRecognition;
  console.log('Using real speech recognition');
} catch (error) {
  // Fall back to mock implementation
  console.warn('Failed to load react-speech-recognition, using mock implementation', error);
  SpeechRecognition = mockSpeechRecognition.SpeechRecognition;
  useSpeechRecognition = mockSpeechRecognition.useSpeechRecognition;
}

const useVoiceSearch = ({ onResult } = {}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Network status listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const startListening = () => {
    if (!browserSupportsSpeechRecognition) {
      setErrorMessage('Your browser does not support speech recognition.');
      return;
    }
    if (!isOnline) {
      setErrorMessage('Internet connection required for voice search.');
      return;
    }

    setErrorMessage('');
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true, // For short phrases. Set true if you want continuous.
      language: 'en-IN',
    }).catch(error => {
      console.error('Error starting speech recognition:', error);
      setErrorMessage('Failed to start speech recognition. Please try again.');
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Listen for results
  useEffect(() => {
    if (transcript && transcript.trim() !== '') {
      onResult?.(transcript.trim());
    }
  }, [transcript, onResult]);

  return {
    isListening: listening,
    transcript,
    errorMessage,
    toggleListening,
    resetTranscript,
    isOnline,
    browserSupportsSpeechRecognition,
  };
};

export default useVoiceSearch;