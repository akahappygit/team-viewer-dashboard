import React, { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, X, Search, Plus, Settings, HelpCircle, Zap } from 'lucide-react';
const KeyboardShortcutsContext = createContext();
export const useKeyboardShortcuts = () => {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
};
// Default shortcuts configuration
const DEFAULT_SHORTCUTS = {
  // Global shortcuts
  'ctrl+k': { action: 'openCommandPalette', description: 'Open command palette', global: true },
  'ctrl+/': { action: 'showShortcuts', description: 'Show keyboard shortcuts', global: true },
  'escape': { action: 'closeModal', description: 'Close modal/dialog', global: true },
  // Navigation shortcuts
  'ctrl+1': { action: 'navigateToDashboard', description: 'Go to Dashboard', global: true },
  'ctrl+2': { action: 'navigateToAnalytics', description: 'Go to Analytics', global: true },
  'ctrl+3': { action: 'navigateToInsights', description: 'Go to AI Insights', global: true },
  'ctrl+4': { action: 'navigateToAutomation', description: 'Go to Automation', global: true },
  // Action shortcuts
  'ctrl+n': { action: 'createNew', description: 'Create new item', global: true },
  'ctrl+s': { action: 'save', description: 'Save current item', global: false },
  'ctrl+e': { action: 'edit', description: 'Edit current item', global: false },
  'delete': { action: 'delete', description: 'Delete selected item', global: false },
  'ctrl+z': { action: 'undo', description: 'Undo last action', global: true },
  'ctrl+y': { action: 'redo', description: 'Redo last action', global: true },
  // Search and filter shortcuts
  'ctrl+f': { action: 'search', description: 'Search/Filter', global: true },
  'ctrl+shift+f': { action: 'advancedSearch', description: 'Advanced search', global: true },
  // Bulk operations
  'ctrl+a': { action: 'selectAll', description: 'Select all items', global: false },
  'ctrl+shift+a': { action: 'deselectAll', description: 'Deselect all items', global: false },
  'ctrl+shift+d': { action: 'bulkDelete', description: 'Bulk delete selected', global: false },
  // View shortcuts
  'ctrl+shift+l': { action: 'toggleLayout', description: 'Toggle layout view', global: true },
  'ctrl+shift+t': { action: 'toggleTheme', description: 'Toggle dark/light theme', global: true },
  'f11': { action: 'toggleFullscreen', description: 'Toggle fullscreen', global: true }
};
// Command palette component
const CommandPalette = ({ isOpen, onClose, shortcuts, onExecute }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const filteredShortcuts = Object.entries(shortcuts).filter(([key, shortcut]) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      key.toLowerCase().includes(searchLower) ||
      shortcut.description.toLowerCase().includes(searchLower) ||
      shortcut.action.toLowerCase().includes(searchLower)
    );
  });
  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredShortcuts.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredShortcuts[selectedIndex]) {
          const [key, shortcut] = filteredShortcuts[selectedIndex];
          onExecute(shortcut.action, { key, shortcut });
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [filteredShortcuts, selectedIndex, onExecute, onClose]);
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
    }
  }, [isOpen]);
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
            <Command className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Type a command or search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {}
          <div className="max-h-96 overflow-y-auto">
            {filteredShortcuts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No commands found</p>
              </div>
            ) : (
              <div className="p-2">
                {filteredShortcuts.map(([key, shortcut], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => {
                      onExecute(shortcut.action, { key, shortcut });
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {shortcut.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Action: {shortcut.action}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {key.split('+').map((part, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <span className="text-gray-400">+</span>}
                          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded border">
                            {part}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
// Shortcuts help modal
const ShortcutsHelp = ({ isOpen, onClose, shortcuts }) => {
  const groupedShortcuts = Object.entries(shortcuts).reduce((groups, [key, shortcut]) => {
    const category = shortcut.category || 'General';
    if (!groups[category]) groups[category] = [];
    groups[category].push([key, shortcut]);
    return groups;
  }, {});
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Keyboard Shortcuts
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                <div key={category} className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map(([key, shortcut]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <span className="text-gray-700 dark:text-gray-300">
                          {shortcut.description}
                        </span>
                        <div className="flex items-center gap-1">
                          {key.split('+').map((part, i) => (
                            <React.Fragment key={i}>
                              {i > 0 && <span className="text-gray-400">+</span>}
                              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 text-xs rounded border border-gray-300 dark:border-gray-600 font-mono">
                                {part}
                              </kbd>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
// Main provider component
const KeyboardShortcutsProvider = ({ children, customShortcuts = {}, onShortcut }) => {
  const [shortcuts] = useState({ ...DEFAULT_SHORTCUTS, ...customShortcuts });
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [activeShortcuts, setActiveShortcuts] = useState(new Set());
  const executeAction = useCallback((action, context = {}) => {
    // Built-in actions
    switch (action) {
      case 'openCommandPalette':
        setCommandPaletteOpen(true);
        break;
      case 'showShortcuts':
        setHelpModalOpen(true);
        break;
      case 'closeModal':
        setCommandPaletteOpen(false);
        setHelpModalOpen(false);
        break;
      default:
        // Custom action handler
        if (onShortcut) {
          onShortcut(action, context);
        }
        break;
    }
  }, [onShortcut]);
  const handleKeyDown = useCallback((event) => {
    // Don't trigger shortcuts when typing in inputs
    if (
      event.target.tagName === 'INPUT' ||
      event.target.tagName === 'TEXTAREA' ||
      event.target.contentEditable === 'true'
    ) {
      // Allow some global shortcuts even in inputs
      const key = getKeyString(event);
      const shortcut = shortcuts[key];
      if (!shortcut || !shortcut.global) return;
    }
    const key = getKeyString(event);
    const shortcut = shortcuts[key];
    if (shortcut) {
      event.preventDefault();
      setActiveShortcuts(prev => new Set([...prev, key]));
      executeAction(shortcut.action, { key, shortcut, event });
      // Remove from active shortcuts after animation
      setTimeout(() => {
        setActiveShortcuts(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }, 200);
    }
  }, [shortcuts, executeAction]);
  const handleKeyUp = useCallback((event) => {
    const key = getKeyString(event);
    setActiveShortcuts(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  }, []);
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
  const contextValue = {
    shortcuts,
    activeShortcuts,
    executeAction,
    openCommandPalette: () => setCommandPaletteOpen(true),
    openHelp: () => setHelpModalOpen(true)
  };
  return (
    <KeyboardShortcutsContext.Provider value={contextValue}>
      {children}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        shortcuts={shortcuts}
        onExecute={executeAction}
      />
      <ShortcutsHelp
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        shortcuts={shortcuts}
      />
    </KeyboardShortcutsContext.Provider>
  );
};
// Utility function to get key string from event
const getKeyString = (event) => {
  const parts = [];
  if (event.ctrlKey || event.metaKey) parts.push('ctrl');
  if (event.altKey) parts.push('alt');
  if (event.shiftKey) parts.push('shift');
  let key = event.key.toLowerCase();
  // Normalize special keys
  if (key === ' ') key = 'space';
  if (key === 'arrowup') key = 'up';
  if (key === 'arrowdown') key = 'down';
  if (key === 'arrowleft') key = 'left';
  if (key === 'arrowright') key = 'right';
  parts.push(key);
  return parts.join('+');
};
// Hook for registering component-specific shortcuts
export const useComponentShortcuts = (shortcuts, enabled = true) => {
  const { executeAction } = useKeyboardShortcuts();
  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (event) => {
      const key = getKeyString(event);
      const shortcut = shortcuts[key];
      if (shortcut) {
        event.preventDefault();
        event.stopPropagation();
        executeAction(shortcut.action, { key, shortcut, event });
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [shortcuts, enabled, executeAction]);
};
// Shortcut indicator component
export const ShortcutIndicator = ({ shortcut, className = '' }) => {
  const { activeShortcuts } = useKeyboardShortcuts();
  const isActive = activeShortcuts.has(shortcut);
  return (
    <motion.div
      animate={{
        scale: isActive ? 1.1 : 1,
        backgroundColor: isActive ? '#3b82f6' : 'transparent'
      }}
      className={`inline-flex items-center gap-1 ${className}`}
    >
      {shortcut.split('+').map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-gray-400">+</span>}
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded border text-gray-600 dark:text-gray-400">
            {part}
          </kbd>
        </React.Fragment>
      ))}
    </motion.div>
  );
};
export default KeyboardShortcutsProvider;
