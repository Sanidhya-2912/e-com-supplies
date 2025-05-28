import { useEffect, useState } from 'react';
import { Mic, AlertCircle, WifiOff, MicOff, Info } from 'lucide-react';

const VoiceSearchToast = ({ isListening, transcript, errorMessage }) => {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [showTips, setShowTips] = useState(false);
  
  useEffect(() => {
    // Show toast when listening or when there's an error
    if (isListening || errorMessage) {
      setVisible(true);
      
      // If there's an error message, store it
      if (errorMessage) {
        setError(errorMessage);
        setShowTips(true);
      }
    } else {
      // Add a small delay before hiding to allow users to see the final transcript
      const timer = setTimeout(() => {
        setVisible(false);
        // Clear error state after hiding
        setError(null);
        setShowTips(false);
      }, errorMessage ? 5000 : 2000); // Show longer if there's an error
      
      return () => clearTimeout(timer);
    }
  }, [isListening, errorMessage]);

  // Show voice recognition tips after 3 seconds of listening
  useEffect(() => {
    let tipTimer;
    if (isListening) {
      tipTimer = setTimeout(() => {
        setShowTips(true);
      }, 3000);
    }
    
    return () => clearTimeout(tipTimer);
  }, [isListening]);

  // Don't render anything if not visible
  if (!visible) return null;
  
  // Determine icon and status based on state
  const getStatusInfo = () => {
    if (isListening) {
      return {
        icon: <div className="p-2 bg-primary rounded-full animate-pulse">
                <Mic size={20} className="text-white" />
              </div>,
        title: 'Listening...',
        message: transcript ? `"${transcript}"` : 'Speak now...'
      };
    }
    
    if (error) {
      // Different icons based on error type
      if (error.includes('network')) {
        return {
          icon: <div className="p-2 bg-amber-500 rounded-full">
                  <WifiOff size={20} className="text-white" />
                </div>,
          title: 'Network Error',
          message: error
        };
      } else if (error.includes('microphone') || error.includes('permission')) {
        return {
          icon: <div className="p-2 bg-destructive rounded-full">
                  <MicOff size={20} className="text-destructive-foreground" />
                </div>,
          title: 'Microphone Error',
          message: error
        };
      } else {
        return {
          icon: <div className="p-2 bg-destructive rounded-full">
                  <AlertCircle size={20} className="text-destructive-foreground" />
                </div>,
          title: 'Voice Search Error',
          message: error
        };
      }
    }
    
    // Default state when not listening and no error (transitioning out)
    return {
      icon: <div className="p-2 bg-primary/30 rounded-full">
              <Info size={20} className="text-primary" />
            </div>,
      title: 'Voice Search',
      message: transcript ? `"${transcript}"` : 'Voice search completed'
    };
  };
  
  const { icon, title, message } = getStatusInfo();
  
  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-background border border-border shadow-lg rounded-lg px-4 py-3 z-50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <div className="text-sm font-medium">
              {title}
            </div>
            <div className="text-sm text-muted-foreground mt-1 max-w-xs truncate">
              {message}
            </div>
          </div>
        </div>
        
        {showTips && (
          <div className="text-xs text-muted-foreground mt-1 max-w-xs border-t border-border pt-2 text-center">
            <p className="font-medium mb-1">Voice Search Tips:</p>
            <ul className="list-disc list-inside text-left">
              <li>Speak clearly and at a normal pace</li>
              <li>Use simple search terms like "notebooks" or "blue pens"</li>
              {errorMessage && errorMessage.includes('network') && (
                <>
                  <li>Check your internet connection</li>
                  <li>Try disabling VPN or proxy if you're using one</li>
                  <li>Some browsers may restrict voice services</li>
                </>
              )}
              {errorMessage && errorMessage.includes('microphone') && (
                <li>Allow microphone access in your browser settings</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceSearchToast; 