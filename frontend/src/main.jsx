import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { applySpeechRecognitionPolyfill } from './lib/utils/speechRecognitionPolyfill'

// Apply polyfill before rendering the app
applySpeechRecognitionPolyfill();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)