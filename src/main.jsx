import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import App from './App.jsx';
import './index.css';

// easter egg for the curious
console.log(
  '%c⚡ DSA Virtual Lab %cbuilt by Stark • github.com/StarkAg ',
  'background:#2563eb;color:#fff;font-weight:700;padding:4px 8px;border-radius:4px 0 0 4px;font-family:monospace',
  'background:#0f172a;color:#94a3b8;padding:4px 8px;border-radius:0 4px 4px 0;font-family:monospace'
);

const convexUrl = import.meta.env.VITE_CONVEX_URL;
if (!convexUrl) {
  console.error('VITE_CONVEX_URL is not set — run `npx convex dev` (see .env.local).');
}
const convex = new ConvexReactClient(convexUrl);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConvexProvider>
  </React.StrictMode>
);
