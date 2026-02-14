import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Buffer } from 'buffer';
import { LayoutProvider } from './context/LayoutProvider.jsx';
window.Buffer = Buffer

createRoot(document.getElementById('root')).render(
    <LayoutProvider>
        <App />
    </LayoutProvider>
)
