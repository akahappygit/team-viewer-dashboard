import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { useAccessibility, useKeyboardNavigation } from './AccessibilityProvider';
// Accessible Button Component
export const AccessibleButton = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  onClick,
  className = '',
  ...props
}, ref) => {
  const { announce } = useAccessibility();
  const handleClick = (e) => {
    if (disabled || loading) return;
    if (onClick) {
      onClick(e);
      if (ariaLabel) {
        announce(`${ariaLabel} activated`);
      }
    }
  };
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500'
  };
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
        />
      )}
      {children}
    </button>
  );
});
// Accessible Select Component
export const AccessibleSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  label,
  required = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const listRef = useRef(null);
  const { generateId, getAriaProps, announce } = useAccessibility();
  const selectId = generateId('select');
  const listId = generateId('listbox');
  const labelId = generateId('label');
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const { focusedIndex, handleKeyDown } = useKeyboardNavigation(filteredOptions, {
    onSelect: (option) => {
      onChange(option.value);
      setIsOpen(false);
      announce(`${option.label} selected`);
    },
    onEscape: () => setIsOpen(false),
    searchField: 'label'
  });
  const selectedOption = options.find(opt => opt.value === value);
  useEffect(() => {
    if (isOpen && listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex];
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          id={labelId}
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <button
        ref={selectRef}
        id={selectId}
        type="button"
        className={`relative w-full bg-white dark:bg-gray-800 border rounded-lg px-3 py-2 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}`}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        {...getAriaProps('combobox', {
          expanded: isOpen,
          haspopup: 'listbox',
          controls: listId,
          labelledBy: label ? labelId : undefined,
          invalid: !!error,
          required
        })}
      >
        <span className="block truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
          >
            {}
            {options.length > 10 && (
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-labelledby={labelId}
            >
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-gray-500 text-center">
                  No options found
                </li>
              ) : (
                filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={option.value === value}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                      index === focusedIndex ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    } ${option.value === value ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-900 dark:text-white'}`}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      announce(`${option.label} selected`);
                    }}
                  >
                    <span className="block truncate font-normal">
                      {option.label}
                    </span>
                    {option.value === value && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
// Accessible Modal Component
export const AccessibleModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = ''
}) => {
  const modalRef = useRef(null);
  const { saveFocus, restoreFocus, setTrapFocus, generateId } = useAccessibility();
  const titleId = generateId('modal-title');
  const descriptionId = generateId('modal-description');
  useEffect(() => {
    if (isOpen) {
      saveFocus();
      setTrapFocus(true);
      // Focus the modal after it opens
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
    } else {
      setTrapFocus(false);
      restoreFocus();
    }
    return () => {
      setTrapFocus(false);
    };
  }, [isOpen, saveFocus, restoreFocus, setTrapFocus]);
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl'
  };
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={closeOnOverlayClick ? onClose : undefined}
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden ${className}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
        >
          {}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 id={titleId} className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {}
          <div id={descriptionId} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
// Accessible Toast Notification
export const AccessibleToast = ({
  type = 'info',
  title,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  const { announce } = useAccessibility();
  useEffect(() => {
    if (isVisible) {
      const priority = type === 'error' ? 'assertive' : 'polite';
      announce(`${title}: ${message}`, priority);
    }
  }, [isVisible, title, message, type, announce]);
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };
  const Icon = icons[type];
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full border rounded-lg p-4 shadow-lg ${colors[type]}`}
          role="alert"
          aria-live={type === 'error' ? 'assertive' : 'polite'}
          aria-atomic="true"
        >
          <div className="flex items-start">
            <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className="font-medium mb-1">{title}</h4>
              )}
              <p className="text-sm">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-3 flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-current"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
// Accessible Progress Bar
export const AccessibleProgress = ({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'medium',
  color = 'blue',
  className = ''
}) => {
  const { generateId } = useAccessibility();
  const progressId = generateId('progress');
  const labelId = generateId('progress-label');
  const percentage = Math.round((value / max) * 100);
  const sizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  };
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600'
  };
  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label id={labelId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          {showValue && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full ${colorClasses[color]} transition-all duration-300`}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-labelledby={label ? labelId : undefined}
          aria-valuetext={`${percentage}% complete`}
        />
      </div>
    </div>
  );
};
// Accessible Tabs Component
export const AccessibleTabs = ({
  tabs,
  activeTab,
  onTabChange,
  orientation = 'horizontal',
  className = ''
}) => {
  const { generateId, announce } = useAccessibility();
  const tablistId = generateId('tablist');
  const { focusedIndex, handleKeyDown } = useKeyboardNavigation(tabs, {
    onSelect: (tab, index) => {
      onTabChange(tab.id);
      announce(`${tab.label} tab selected`);
    },
    searchField: 'label'
  });
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
  return (
    <div className={className}>
      <div
        role="tablist"
        id={tablistId}
        aria-orientation={orientation}
        className={`flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'} border-b border-gray-200 dark:border-gray-700`}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === activeTab}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={tab.id === activeTab ? 0 : -1}
            className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              tab.id === activeTab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            } ${index === focusedIndex ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => {
              onTabChange(tab.id);
              announce(`${tab.label} tab selected`);
            }}
          >
            {tab.icon && <tab.icon className="w-4 h-4 mr-2 inline" />}
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map(tab => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== activeTab}
          className="mt-4"
        >
          {tab.id === activeTab && tab.content}
        </div>
      ))}
    </div>
  );
};
