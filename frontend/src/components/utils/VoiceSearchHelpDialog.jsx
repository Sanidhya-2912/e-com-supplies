import { useState, useEffect } from 'react';
import { X, Mic, Info, Download } from 'lucide-react';
import useVoiceSearch from '../../lib/hooks/useVoiceSearch';

const VoiceSearchHelpDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenHelp, setHasSeenHelp] = useState(false);
  const { browserSupportsSpeechRecognition } = useVoiceSearch();
  
  // Check if user has seen the help dialog before
  useEffect(() => {
    const hasSeenVoiceHelp = localStorage.getItem('voice-search-help-seen');
    setHasSeenHelp(!!hasSeenVoiceHelp);
    
    // Show help dialog automatically the first time
    if (!hasSeenVoiceHelp) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);
  
  const closeDialog = () => {
    setIsOpen(false);
    // Store that user has seen the help
    localStorage.setItem('voice-search-help-seen', 'true');
    setHasSeenHelp(true);
  };
  
  const openDialog = () => {
    setIsOpen(true);
  };
  
  return (
    <>
      {/* Help button (only shown after user has seen the dialog once) */}
      {hasSeenHelp && !isOpen && (
        <button
          onClick={openDialog}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
          title="Voice Search Help"
        >
          <Info size={20} />
        </button>
      )}
      
      {/* Help dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background w-full max-w-md rounded-lg shadow-lg p-6 m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Voice Search Instructions</h3>
              <button onClick={closeDialog} className="p-1 hover:bg-accent rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {browserSupportsSpeechRecognition ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-full">
                      <Mic size={20} className="text-primary-foreground" />
                    </div>
                    <p>Click the microphone icon to start voice search</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Try saying:</p>
                    <ul className="ml-6 list-disc space-y-1">
                      <li>"Blue pens"</li>
                      <li>"Notebooks under $10"</li>
                      <li>"Office desk accessories"</li>
                      <li>"Wireless mouse"</li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">
                      <strong>Tip:</strong> Speak clearly and directly into your microphone for best results.
                      The search will automatically start after you finish speaking.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-destructive">
                    <div className="p-2 bg-destructive/10 rounded-full">
                      <Mic size={20} className="text-destructive" />
                    </div>
                    <p className="font-medium">Voice Search Unavailable</p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">
                      <strong>Note:</strong> Voice search functionality requires the react-speech-recognition package.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">How to enable voice search:</p>
                    <div className="ml-6 space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                        <p className="text-sm">Install the package using npm:</p>
                      </div>
                      <div className="bg-gray-900 text-gray-200 p-2 rounded text-xs font-mono ml-7">
                        npm install --save react-speech-recognition
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                        <p className="text-sm">Restart the application server</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <button
                onClick={closeDialog}
                className="w-full py-2 mt-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceSearchHelpDialog; 