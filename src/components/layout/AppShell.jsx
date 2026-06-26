import { Navigate, useNavigate } from 'react-router-dom';
import TopBar from './TopBar.jsx';
import SideBar from './SideBar.jsx';
import { getProfile } from '../../lib/identity.js';

// Wraps authenticated pages with the eLab chrome; redirects to /login if no profile.
export default function AppShell({ children }) {
  const profile = getProfile();
  if (!profile) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen">
      <TopBar profile={profile} />
      <div className="flex">
        <SideBar />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
