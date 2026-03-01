import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AuthModal from './AuthModal';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <AuthModal id="auth-modal" />
    </div>
  );
}
