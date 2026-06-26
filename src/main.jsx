import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import App from './App.jsx';
import './index.css';

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
