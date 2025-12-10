import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import LoadingPage from './pages/loadingPage/LoadingPage';

const root = document.getElementById('root');

// Render a temporary fallback before the main app
root.innerHTML = '<div id="initial-loader"></div>';

const loaderContainer = document.getElementById('initial-loader');
const loaderRoot = createRoot(loaderContainer);

// Show LoadingPage while App is being prepared
loaderRoot.render(<LoadingPage />);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
