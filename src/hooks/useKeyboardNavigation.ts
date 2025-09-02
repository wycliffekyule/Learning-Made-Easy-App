import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavigationKey {
  key: string;
  path: string;
  description: string;
  requiresAuth?: boolean;
}

const navigationKeys: NavigationKey[] = [
  { key: 'h', path: '/dashboard', description: 'Go to Dashboard (Home)', requiresAuth: true },
  { key: 'a', path: '/assessment', description: 'Take Assessment', requiresAuth: true },
  { key: 't', path: '/tutor', description: 'Virtual Tutor', requiresAuth: true },
  { key: 'p', path: '/progress', description: 'View Progress', requiresAuth: true },
  { key: 's', path: '/assignments', description: 'Assignments (Submissions)', requiresAuth: true },
  { key: 'u', path: '/pricing', description: 'Upgrade/Pricing', requiresAuth: true },
  { key: 'c', path: '/contact', description: 'Contact Us', requiresAuth: true },
  { key: 'l', path: '/login', description: 'Login', requiresAuth: false },
  { key: 'r', path: '/register', description: 'Register', requiresAuth: false },
];

export const useKeyboardNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger on Alt + key combinations to avoid conflicts
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      // Don't trigger when user is typing in input fields
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      
      // Special case for help shortcut
      if (key === '?' || key === '/') {
        // This will be handled by the KeyboardShortcuts component
        return;
      }
      
      const navItem = navigationKeys.find(item => item.key === key);

      if (navItem) {
        // Check authentication requirements
        if (navItem.requiresAuth && !user) {
          navigate('/login');
          return;
        }

        // Don't navigate to the same page
        if (location.pathname !== navItem.path) {
          navigate(navItem.path);
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [navigate, location.pathname, user]);

  return { navigationKeys };
};