import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
const AccessibilityContext = createContext();
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
// Keyboard navigation hook
export const useKeyboardNavigation = (items, options = {}) => {
  const [focusedIndex, setFocusedIndex] = useState(options.initialIndex || 0);
  const [isNavigating, setIsNavigating] = useState(false);
  const handleKeyDown = useCallback((event) => {
    if (!items.length) return;
    const { key, ctrlKey, shiftKey, altKey } = event;
    let newIndex = focusedIndex;
    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        newIndex = Math.min(focusedIndex + 1, items.length - 1);
        setIsNavigating(true);
        break;
      case 'ArrowUp':
        event.preventDefault();
        newIndex = Math.max(focusedIndex - 1, 0);
        setIsNavigating(true);
        break;
      case 'Home':
        if (ctrlKey) {
          event.preventDefault();
          newIndex = 0;
          setIsNavigating(true);
        }
        break;
      case 'End':
        if (ctrlKey) {
          event.preventDefault();
          newIndex = items.length - 1;
          setIsNavigating(true);
        }
        break;
      case 'PageDown':
        event.preventDefault();
        newIndex = Math.min(focusedIndex + 10, items.length - 1);
        setIsNavigating(true);
        break;
      case 'PageUp':
        event.preventDefault();
        newIndex = Math.max(focusedIndex - 10, 0);
        setIsNavigating(true);
        break;
      case 'Enter':
      case ' ':
        if (options.onSelect && items[focusedIndex]) {
          event.preventDefault();
          options.onSelect(items[focusedIndex], focusedIndex);
        }
        break;
      case 'Escape':
        if (options.onEscape) {
          event.preventDefault();
          options.onEscape();
        }
        break;
      default:
        // Handle letter navigation
        if (key.length === 1 && !ctrlKey && !altKey && options.searchField) {
          const letter = key.toLowerCase();
          const startIndex = (focusedIndex + 1) % items.length;
          for (let i = 0; i < items.length; i++) {
            const index = (startIndex + i) % items.length;
            const item = items[index];
            const searchValue = item[options.searchField];
            if (searchValue && searchValue.toLowerCase().startsWith(letter)) {
              newIndex = index;
              setIsNavigating(true);
              break;
            }
          }
        }
        break;
    }
    if (newIndex !== focusedIndex) {
      setFocusedIndex(newIndex);
      if (options.onFocusChange) {
        options.onFocusChange(newIndex, items[newIndex]);
      }
    }
  }, [focusedIndex, items, options]);
  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => setIsNavigating(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isNavigating]);
  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    isNavigating
  };
};
// Screen reader announcements hook
export const useScreenReader = () => {
  const [announcements, setAnnouncements] = useState([]);
  const announce = useCallback((message, priority = 'polite') => {
    const id = Date.now();
    setAnnouncements(prev => [...prev, { id, message, priority }]);
    // Remove announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }, 1000);
  }, []);
  const announceError = useCallback((message) => {
    announce(message, 'assertive');
  }, [announce]);
  const announceSuccess = useCallback((message) => {
    announce(message, 'polite');
  }, [announce]);
  return {
    announce,
    announceError,
    announceSuccess,
    announcements
  };
};
// Focus management hook
export const useFocusManagement = () => {
  const [focusHistory, setFocusHistory] = useState([]);
  const [trapFocus, setTrapFocus] = useState(false);
  const containerRef = useRef(null);
  const saveFocus = useCallback(() => {
    const activeElement = document.activeElement;
    if (activeElement && activeElement !== document.body) {
      setFocusHistory(prev => [...prev, activeElement]);
    }
  }, []);
  const restoreFocus = useCallback(() => {
    const lastFocused = focusHistory[focusHistory.length - 1];
    if (lastFocused && lastFocused.focus) {
      lastFocused.focus();
      setFocusHistory(prev => prev.slice(0, -1));
    }
  }, [focusHistory]);
  const focusFirst = useCallback(() => {
    if (!containerRef.current) return;
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, []);
  const focusLast = useCallback(() => {
    if (!containerRef.current) return;
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, []);
  // Focus trap implementation
  useEffect(() => {
    if (!trapFocus || !containerRef.current) return;
    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return;
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [trapFocus]);
  return {
    containerRef,
    saveFocus,
    restoreFocus,
    focusFirst,
    focusLast,
    setTrapFocus
  };
};
// ARIA attributes helper
export const useAriaAttributes = (options = {}) => {
  const generateId = useCallback((prefix = 'aria') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);
  const getAriaProps = useCallback((type, props = {}) => {
    const baseProps = {
      role: props.role,
      'aria-label': props.label,
      'aria-labelledby': props.labelledBy,
      'aria-describedby': props.describedBy,
      'aria-expanded': props.expanded,
      'aria-selected': props.selected,
      'aria-checked': props.checked,
      'aria-disabled': props.disabled,
      'aria-hidden': props.hidden,
      'aria-live': props.live || 'polite',
      'aria-atomic': props.atomic,
      'aria-relevant': props.relevant,
      'aria-busy': props.busy,
      'aria-invalid': props.invalid,
      'aria-required': props.required,
      'aria-readonly': props.readonly,
      'aria-multiselectable': props.multiselectable,
      'aria-orientation': props.orientation,
      'aria-sort': props.sort,
      'aria-level': props.level,
      'aria-setsize': props.setsize,
      'aria-posinset': props.posinset,
      'aria-controls': props.controls,
      'aria-owns': props.owns,
      'aria-activedescendant': props.activedescendant,
      'aria-autocomplete': props.autocomplete,
      'aria-haspopup': props.haspopup,
      'aria-modal': props.modal,
      tabIndex: props.tabIndex
    };
    // Filter out undefined values
    return Object.fromEntries(
      Object.entries(baseProps).filter(([_, value]) => value !== undefined)
    );
  }, []);
  return {
    generateId,
    getAriaProps
  };
};
const AccessibilityProvider = ({ children, options = {} }) => {
  const [settings, setSettings] = useState({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReaderMode: false,
    keyboardNavigation: true,
    focusVisible: true,
    announcements: true,
    ...options
  });
  const screenReader = useScreenReader();
  const focusManagement = useFocusManagement();
  const ariaAttributes = useAriaAttributes();
  // Detect user preferences
  useEffect(() => {
    const mediaQueries = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
      highContrast: window.matchMedia('(prefers-contrast: high)'),
      largeText: window.matchMedia('(prefers-font-size: large)')
    };
    const updateSettings = () => {
      setSettings(prev => ({
        ...prev,
        reducedMotion: mediaQueries.reducedMotion.matches,
        highContrast: mediaQueries.highContrast.matches,
        largeText: mediaQueries.largeText.matches
      }));
    };
    // Initial check
    updateSettings();
    // Listen for changes
    Object.values(mediaQueries).forEach(mq => {
      mq.addEventListener('change', updateSettings);
    });
    return () => {
      Object.values(mediaQueries).forEach(mq => {
        mq.removeEventListener('change', updateSettings);
      });
    };
  }, []);
  // Apply accessibility classes to document
  useEffect(() => {
    const classes = [];
    if (settings.reducedMotion) classes.push('reduce-motion');
    if (settings.highContrast) classes.push('high-contrast');
    if (settings.largeText) classes.push('large-text');
    if (settings.screenReaderMode) classes.push('screen-reader-mode');
    if (settings.focusVisible) classes.push('focus-visible');
    document.documentElement.className = classes.join(' ');
    return () => {
      document.documentElement.className = '';
    };
  }, [settings]);
  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);
  const contextValue = {
    settings,
    updateSetting,
    ...screenReader,
    ...focusManagement,
    ...ariaAttributes
  };
  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      {}
      {settings.announcements && (
        <div className="sr-only">
          {screenReader.announcements.map(({ id, message, priority }) => (
            <div
              key={id}
              aria-live={priority}
              aria-atomic="true"
            >
              {message}
            </div>
          ))}
        </div>
      )}
    </AccessibilityContext.Provider>
  );
};
// Accessibility testing component (development only)
export const AccessibilityTester = () => {
  const [issues, setIssues] = useState([]);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const checkAccessibility = () => {
      const foundIssues = [];
      // Check for missing alt text on images
      const images = document.querySelectorAll('img:not([alt])');
      if (images.length > 0) {
        foundIssues.push(`${images.length} images missing alt text`);
      }
      // Check for missing form labels
      const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      const unlabeledInputs = Array.from(inputs).filter(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        return !label && input.type !== 'hidden';
      });
      if (unlabeledInputs.length > 0) {
        foundIssues.push(`${unlabeledInputs.length} form inputs missing labels`);
      }
      // Check for missing headings hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      let hierarchyIssues = 0;
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > lastLevel + 1) {
          hierarchyIssues++;
        }
        lastLevel = level;
      });
      if (hierarchyIssues > 0) {
        foundIssues.push(`${hierarchyIssues} heading hierarchy issues`);
      }
      // Check for low contrast (simplified check)
      const elements = document.querySelectorAll('*');
      let contrastIssues = 0;
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        // This is a simplified check - in production, use a proper contrast ratio calculator
        if (color === 'rgb(128, 128, 128)' && backgroundColor === 'rgb(255, 255, 255)') {
          contrastIssues++;
        }
      });
      if (contrastIssues > 0) {
        foundIssues.push(`${contrastIssues} potential contrast issues`);
      }
      setIssues(foundIssues);
    };
    const timer = setTimeout(checkAccessibility, 1000);
    return () => clearTimeout(timer);
  }, []);
  if (process.env.NODE_ENV !== 'development' || issues.length === 0) {
    return null;
  }
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg z-50">
      <h4 className="font-semibold mb-2">Accessibility Issues:</h4>
      <ul className="text-sm space-y-1">
        {issues.map((issue, index) => (
          <li key={index}>• {issue}</li>
        ))}
      </ul>
    </div>
  );
};
export default AccessibilityProvider;
