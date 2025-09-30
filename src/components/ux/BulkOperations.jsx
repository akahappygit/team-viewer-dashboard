import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  Edit3, 
  Archive, 
  Download, 
  Upload,
  MoreHorizontal,
  X,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '../notifications/ToastNotifications';
import { useKeyboardNavigation } from '../accessibility/AccessibilityProvider';
// Bulk operations context
const BulkOperationsContext = React.createContext();
export const useBulkOperations = () => {
  const context = React.useContext(BulkOperationsContext);
  if (!context) {
    throw new Error('useBulkOperations must be used within BulkOperationsProvider');
  }
  return context;
};
// Bulk operations provider
export const BulkOperationsProvider = ({ children, onBulkAction }) => {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [bulkActionInProgress, setBulkActionInProgress] = useState(false);
  const { showToast } = useToast();
  const selectItem = useCallback((id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);
  const selectAll = useCallback((items) => {
    setSelectedItems(new Set(items.map(item => item.id)));
  }, []);
  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
    setIsSelectionMode(false);
  }, []);
  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode(prev => !prev);
    if (isSelectionMode) {
      clearSelection();
    }
  }, [isSelectionMode, clearSelection]);
  const executeBulkAction = useCallback(async (action, options = {}) => {
    if (selectedItems.size === 0) {
      showToast('No items selected', 'warning');
      return;
    }
    setBulkActionInProgress(true);
    try {
      const result = await onBulkAction(action, Array.from(selectedItems), options);
      showToast(
        `${action} completed for ${selectedItems.size} item${selectedItems.size > 1 ? 's' : ''}`,
        'success'
      );
      clearSelection();
      return result;
    } catch (error) {
      showToast(`Failed to ${action}: ${error.message}`, 'error');
      throw error;
    } finally {
      setBulkActionInProgress(false);
    }
  }, [selectedItems, onBulkAction, showToast, clearSelection]);
  const value = {
    selectedItems,
    isSelectionMode,
    bulkActionInProgress,
    selectItem,
    selectAll,
    clearSelection,
    toggleSelectionMode,
    executeBulkAction,
    selectedCount: selectedItems.size
  };
  return (
    <BulkOperationsContext.Provider value={value}>
      {children}
    </BulkOperationsContext.Provider>
  );
};
// Selectable item wrapper
export const SelectableItem = ({ 
  id, 
  children, 
  className = '',
  disabled = false,
  ...props 
}) => {
  const { selectedItems, isSelectionMode, selectItem } = useBulkOperations();
  const isSelected = selectedItems.has(id);
  const handleClick = useCallback((e) => {
    if (isSelectionMode && !disabled) {
      e.preventDefault();
      e.stopPropagation();
      selectItem(id);
    }
  }, [isSelectionMode, disabled, selectItem, id]);
  const handleKeyDown = useCallback((e) => {
    if (isSelectionMode && !disabled && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      selectItem(id);
    }
  }, [isSelectionMode, disabled, selectItem, id]);
  return (
    <motion.div
      className={`
        relative transition-all duration-200
        ${isSelectionMode ? 'cursor-pointer' : ''}
        ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isSelectionMode && !disabled ? 0 : -1}
      role={isSelectionMode ? 'checkbox' : undefined}
      aria-checked={isSelectionMode ? isSelected : undefined}
      whileHover={isSelectionMode && !disabled ? { scale: 1.02 } : {}}
      whileTap={isSelectionMode && !disabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {isSelectionMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute top-2 left-2 z-10"
        >
          <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg border border-gray-200 dark:border-gray-700">
            {isSelected ? (
              <CheckSquare className="w-4 h-4 text-blue-600" />
            ) : (
              <Square className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </motion.div>
      )}
      {children}
    </motion.div>
  );
};
// Bulk actions toolbar
export const BulkActionsToolbar = ({ 
  actions = [],
  position = 'bottom',
  className = ''
}) => {
  const { 
    selectedCount, 
    isSelectionMode, 
    bulkActionInProgress, 
    clearSelection,
    executeBulkAction 
  } = useBulkOperations();
  const [showConfirmation, setShowConfirmation] = useState(null);
  const defaultActions = [
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      variant: 'danger',
      requiresConfirmation: true,
      confirmationMessage: 'Are you sure you want to delete the selected items?'
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: Archive,
      variant: 'secondary'
    },
    {
      id: 'export',
      label: 'Export',
      icon: Download,
      variant: 'primary'
    }
  ];
  const allActions = [...defaultActions, ...actions];
  const handleAction = useCallback(async (action) => {
    if (action.requiresConfirmation) {
      setShowConfirmation(action);
    } else {
      await executeBulkAction(action.id, action.options);
    }
  }, [executeBulkAction]);
  const handleConfirmedAction = useCallback(async () => {
    if (showConfirmation) {
      await executeBulkAction(showConfirmation.id, showConfirmation.options);
      setShowConfirmation(null);
    }
  }, [showConfirmation, executeBulkAction]);
  if (!isSelectionMode || selectedCount === 0) {
    return null;
  }
  const positionClasses = {
    top: 'top-4 left-1/2 transform -translate-x-1/2',
    bottom: 'bottom-4 left-1/2 transform -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };
  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: position.includes('bottom') ? 20 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position.includes('bottom') ? 20 : -20 }}
          className={`
            fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700
            ${positionClasses[position]}
            ${className}
          `}
        >
          <div className="flex items-center gap-2 p-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedCount} selected
            </span>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
            <div className="flex items-center gap-1">
              {allActions.map((action) => {
                const Icon = action.icon;
                const variantClasses = {
                  primary: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
                  secondary: 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
                  danger: 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                };
                return (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action)}
                    disabled={bulkActionInProgress}
                    className={`
                      p-2 rounded-md transition-colors duration-200
                      ${variantClasses[action.variant] || variantClasses.secondary}
                      ${bulkActionInProgress ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    title={action.label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
            <button
              onClick={clearSelection}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
      {}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setShowConfirmation(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Confirm Action
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {showConfirmation.confirmationMessage}
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfirmation(null)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmedAction}
                    disabled={bulkActionInProgress}
                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors duration-200 disabled:opacity-50"
                  >
                    {bulkActionInProgress ? 'Processing...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
// Selection toggle button
export const SelectionToggle = ({ className = '' }) => {
  const { isSelectionMode, toggleSelectionMode, selectedCount } = useBulkOperations();
  return (
    <button
      onClick={toggleSelectionMode}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200
        ${isSelectionMode 
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }
        ${className}
      `}
    >
      {isSelectionMode ? (
        <>
          <CheckCircle className="w-4 h-4" />
          <span>Exit Selection ({selectedCount})</span>
        </>
      ) : (
        <>
          <CheckSquare className="w-4 h-4" />
          <span>Select Items</span>
        </>
      )}
    </button>
  );
};
// Select all button
export const SelectAllButton = ({ items = [], className = '' }) => {
  const { selectAll, selectedItems, isSelectionMode } = useBulkOperations();
  const allSelected = items.length > 0 && items.every(item => selectedItems.has(item.id));
  if (!isSelectionMode) {
    return null;
  }
  return (
    <button
      onClick={() => selectAll(items)}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200
        text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
        ${className}
      `}
    >
      {allSelected ? (
        <CheckSquare className="w-4 h-4 text-blue-600" />
      ) : (
        <Square className="w-4 h-4" />
      )}
      <span>Select All ({items.length})</span>
    </button>
  );
};
// Bulk operations summary
export const BulkOperationsSummary = ({ className = '' }) => {
  const { selectedCount, isSelectionMode } = useBulkOperations();
  if (!isSelectionMode || selectedCount === 0) {
    return null;
  }
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`
        bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
          {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
        </span>
      </div>
    </motion.div>
  );
};
export default BulkOperationsProvider;
