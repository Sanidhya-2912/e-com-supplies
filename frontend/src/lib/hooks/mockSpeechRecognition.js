// This is a mock implementation of react-speech-recognition
// It provides the same interface but without actual speech recognition functionality
// This allows the app to function without errors when the package isn't available

import { useState } from 'react';

// Flag to ensure we only show the message once per session
let hasShownVoiceSearchMessage = false;

// Predefined search terms that will "work" with the mock implementation
const MOCK_SEARCH_TERMS = [
  { phrase: "notebooks", delay: 1500 },
  { phrase: "pens", delay: 1200 },
  { phrase: "desk accessories", delay: 2000 },
  { phrase: "electronics", delay: 1800 },
  { phrase: "office supplies", delay: 1700 },
  { phrase: "paper", delay: 900 },
  { phrase: "pencils", delay: 1300 }
];

// Helper function to create toast notifications (instead of alerts)
const showToastNotification = (message, type = 'warning') => {
  // Remove existing toast if present
  const existingToast = document.getElementById('voice-search-toast');
  if (existingToast) {
    document.body.removeChild(existingToast);
  }
  
  // Create toast container
  const toast = document.createElement('div');
  toast.id = 'voice-search-toast';
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.zIndex = '9999';
  toast.style.padding = '10px 15px';
  toast.style.borderRadius = '6px';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.transition = 'all 0.3s ease-in-out';
  toast.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
  toast.style.fontSize = '14px';
  toast.style.maxWidth = '320px';
  
  // Set colors based on type
  if (type === 'warning') {
    toast.style.backgroundColor = '#fff7e0';
    toast.style.color = '#7a5b00';
    toast.style.border = '1px solid #ffd980';
  } else if (type === 'error') {
    toast.style.backgroundColor = '#ffece6';
    toast.style.color = '#b42c00';
    toast.style.border = '1px solid #ffbaa6';
  } else {
    toast.style.backgroundColor = '#e9f5ff';
    toast.style.color = '#006fc4';
    toast.style.border = '1px solid #b3d9ff';
  }
  
  // Create icon container
  const iconContainer = document.createElement('div');
  iconContainer.style.marginRight = '12px';
  iconContainer.innerHTML = type === 'warning' 
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  toast.appendChild(iconContainer);
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.style.flex = '1';
  messageElement.textContent = message;
  toast.appendChild(messageElement);
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.cursor = 'pointer';
  closeButton.style.marginLeft = '10px';
  closeButton.style.color = 'currentColor';
  closeButton.style.opacity = '0.7';
  closeButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  closeButton.onclick = () => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  };
  toast.appendChild(closeButton);
  
  // Add to DOM
  document.body.appendChild(toast);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }
  }, 5000);
  
  return toast;
};

// Check if we are in a browser environment with connectivity
const checkNetworkConnectivity = () => {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return navigator.onLine;
  }
  return true; // Assume online if we can't detect
};

// Helper function to get a random search term
const getRandomSearchTerm = () => {
  const randomIndex = Math.floor(Math.random() * MOCK_SEARCH_TERMS.length);
  return MOCK_SEARCH_TERMS[randomIndex];
};

// Mock SpeechRecognition object with improved "fake" recognition
export const mockSpeechRecognition = {
  startListening: ({ continuous = false, language = 'en-US' } = {}) => {
    console.log('Mock speech recognition activated - simulating voice input with predefined terms');
    
    // Check network connectivity
    if (!checkNetworkConnectivity()) {
      const errorMessage = 'Network error occurred. Check your internet connection.';
      if (mockSpeechRecognition.onError) {
        mockSpeechRecognition.onError(errorMessage);
      }
      showToastNotification('Network connectivity issue. Voice search unavailable.', 'error');
      return Promise.reject(new Error(errorMessage));
    }
    
    // Show alternative message - be honest that it's a mock implementation
    if (!hasShownVoiceSearchMessage) {
      hasShownVoiceSearchMessage = true;
      showToastNotification('Using simulated voice recognition with predefined search terms', 'info');
    }
    
    return Promise.resolve();
  },
  stopListening: () => {
    // Nothing happens
    return Promise.resolve();
  },
  abortListening: () => {
    // Nothing happens
  },
  browserSupportsSpeechRecognition: true, // We're faking it, so claim it's supported
  isMicrophoneAvailable: true, // Also claim microphone is available
  onError: null,
};

// Mock hook with simulated recognition
export const mockUseSpeechRecognition = (props = {}) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  // Set up error handler
  mockSpeechRecognition.onError = (errorMessage) => {
    setError(errorMessage);
    setListening(false);
    // Reset error after 5 seconds
    setTimeout(() => setError(''), 5000);
  };

  // Override the startListening to set our mock state
  const originalStart = mockSpeechRecognition.startListening;
  mockSpeechRecognition.startListening = (options) => {
    setListening(true);
    
    // Get random search term to simulate recognition
    const { phrase, delay } = getRandomSearchTerm();
    
    // Simulate the "thinking" time and then set fake transcript
    setTimeout(() => {
      if (checkNetworkConnectivity()) {
        setTranscript(phrase);
        
        // Keep "listening" for a bit then stop
        setTimeout(() => {
          setListening(false);
        }, 1000);
      } else {
        // Simulate network error
        mockSpeechRecognition.onError('Network error occurred. Check your internet connection.');
      }
    }, delay);
    
    return originalStart(options);
  };

  // Override stopListening
  const originalStop = mockSpeechRecognition.stopListening;
  mockSpeechRecognition.stopListening = () => {
    setListening(false);
    return originalStop();
  };

  return {
    transcript,
    listening,
    resetTranscript: () => setTranscript(''),
    browserSupportsSpeechRecognition: true, // Always claim it's supported
    isMicrophoneAvailable: true, // Always claim microphone is available
    error
  };
};

export default {
  SpeechRecognition: mockSpeechRecognition,
  useSpeechRecognition: mockUseSpeechRecognition
}; 