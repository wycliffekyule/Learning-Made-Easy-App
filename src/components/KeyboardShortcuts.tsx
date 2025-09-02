import React, { useState } from 'react';
import { useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useAuth } from '../contexts/AuthContext';

const KeyboardShortcuts: React.FC = () => {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { navigationKeys } = useKeyboardNavigation();
  const { user } = useAuth();

  // Handle Alt + ? to toggle shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.altKey && (event.key === '?' || event.key === '/')) {
        setShowShortcuts(prev => !prev);
        event.preventDefault();
      }
      
      // Close on Escape
      if (event.key === 'Escape' && showShortcuts) {
        setShowShortcuts(false);
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showShortcuts]);

  const filteredKeys = navigationKeys.filter(key => 
    !key.requiresAuth || (key.requiresAuth && user)
  );

  return (
    <>
      {/* Keyboard Shortcuts Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowShortcuts(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-40"
        title="Keyboard Shortcuts (Alt + ?)"
      >
        <Keyboard className="w-6 h-6" />
      </motion.button>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Keyboard Shortcuts</h3>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Use <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Alt</kbd> + key combinations to navigate quickly:
                </p>
                
                {filteredKeys.map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2">
                    <span className="text-gray-700">{item.description}</span>
                    <div className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Alt</kbd>
                      <span className="text-gray-400">+</span>
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono uppercase">
                        {item.key}
                      </kbd>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Alt + ?</kbd> to toggle this help
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;