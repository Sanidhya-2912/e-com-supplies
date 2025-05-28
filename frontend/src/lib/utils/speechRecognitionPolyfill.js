/**
 * This file contains a polyfill for the Web Speech API
 * It doesn't actually add speech recognition functionality
 * but provides a graceful fallback to prevent app crashes
 * in unsupported browsers
 */

// Check if the Speech Recognition API is supported in the browser
const isSpeechRecognitionSupported = () => {
  return 'SpeechRecognition' in window || 
         'webkitSpeechRecognition' in window || 
         'mozSpeechRecognition' in window || 
         'msSpeechRecognition' in window;
};

// Apply polyfill if needed
export const applySpeechRecognitionPolyfill = () => {
  if (!isSpeechRecognitionSupported()) {
    console.warn('Speech Recognition API is not supported in this browser. Using polyfill instead.');
    
    // Create mock SpeechRecognition class
    window.SpeechRecognition = class MockSpeechRecognition {
      constructor() {
        this.continuous = false;
        this.interimResults = false;
        this.lang = 'en-US';
        this.maxAlternatives = 1;
        
        // Mock events
        this.onstart = null;
        this.onresult = null;
        this.onerror = null;
        this.onend = null;
      }

      // Mock methods
      start() {
        console.warn('Speech recognition not supported. Trigger fallback UI.');
        
        if (this.onstart) {
          this.onstart(new Event('start'));
        }
        
        // Simulate error event
        setTimeout(() => {
          if (this.onerror) {
            const error = new Event('error');
            error.error = 'not-supported';
            error.message = 'Speech recognition not supported in this browser';
            this.onerror(error);
          }
          
          // End session
          setTimeout(() => {
            if (this.onend) {
              this.onend(new Event('end'));
            }
          }, 100);
        }, 500);
      }

      stop() {
        if (this.onend) {
          this.onend(new Event('end'));
        }
      }

      abort() {
        this.stop();
      }
    };

    // Use webkitSpeechRecognition as a fallback for Chrome
    window.webkitSpeechRecognition = window.SpeechRecognition;
  }
};

export default applySpeechRecognitionPolyfill; 