import { useState, useEffect } from 'react';
import { Mic, Info, AlertCircle, MicOff, WifiOff } from 'lucide-react';

const VoiceSearchToast = ({ isListening, transcript, errorMessage }) => {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  
  // Show toast when listening or when there's an error
  useEffect(() => {
    if (isListening||  errorMessage) {
      setVisible(true);
      setError(errorMessage ||'');
      
      // Hide toast after stopping listening (with a delay)
      if (!isListening && !errorMessage) {
        const timer = setTimeout(() => {
          setVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      // Add delay before hiding toast when stopped listening
      const timer = setTimeout(() => {
        setVisible(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isListening, errorMessage]);
  
  // Early return if not visible
  if (!visible) return null;
  
  const getStatusInfo = () => {
    if (isListening) {
      return {
        icon: <div className="p-2 bg-primary rounded-full animate-pulse">
                <Mic size={20} className="text-white" />
              </div>,
        title: 'Listening...',
        message: transcript ? "${transcript}" : 'Speak now...'
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
      message: transcript ? "${transcript}" : 'Voice search completed'
    };
  };
  
  const { icon, title, message } = getStatusInfo();
  
  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background border border-border shadow-lg rounded-lg p-3 z-50 flex items-center gap-3 max-w-md transition-opacity ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {icon}
      <div>
        <h5 className="font-medium text-sm">{title}</h5>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default VoiceSearchToast;