import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import KeyboardShortcuts from './KeyboardShortcuts';
import { useAuth } from '../contexts/AuthContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

const Layout: React.FC = () => {
  const { user } = useAuth();
  useKeyboardNavigation();

  if (!user) {
    return (
      <>
        <Outlet />
        <KeyboardShortcuts />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
      <KeyboardShortcuts />
    </div>
  );
};

export default Layout;