import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { FixedSizeList as List, areEqual } from 'react-window';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc, Loader2 } from 'lucide-react';
import { useDebounce, useThrottle, usePerformanceMonitor } from '../../hooks/usePerformanceOptimization';
const VirtualizedList = memo(({
  items = [],
  itemHeight = 80,
  height = 400,
  width = '100%',
  renderItem,
  className = '',
  overscanCount = 5,
  onItemClick,
  loading = false,
  emptyMessage = 'No items to display',
  loadingMessage = 'Loading...'
}) => {
  // Memoize the item renderer to prevent unnecessary re-renders
  const ItemRenderer = useCallback(({ index, style }) => {
    const item = items[index];
    if (!item) {
      return (
        <div style={style} className="flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Item not found</div>
        </div>
      );
    }
    return (
      <motion.div
        style={style}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: index * 0.01 }}
        className="px-2"
      >
        <div
          className={`h-full flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors ${
            onItemClick ? 'cursor-pointer' : ''
          }`}
          onClick={() => onItemClick && onItemClick(item, index)}
        >
          {renderItem ? renderItem(item, index) : (
            <div className="flex-1 p-4">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {item.name || item.title || `Item ${index + 1}`}
              </div>
              {item.description && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {item.description}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }, [items, renderItem, onItemClick]);
  // Memoize the list component
  const VirtualList = useMemo(() => {
    if (loading) {
      return (
        <div 
          className={`flex items-center justify-center ${className}`}
          style={{ height, width }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {loadingMessage}
            </div>
          </div>
        </div>
      );
    }
    if (!items || items.length === 0) {
      return (
        <div 
          className={`flex items-center justify-center ${className}`}
          style={{ height, width }}
        >
          <div className="text-center text-gray-500 dark:text-gray-400">
            {emptyMessage}
          </div>
        </div>
      );
    }
    return (
      <div className={className}>
        <List
          height={height}
          width={width}
          itemCount={items.length}
          itemSize={itemHeight}
          overscanCount={overscanCount}
          className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
        >
          {ItemRenderer}
        </List>
      </div>
    );
  }, [
    items,
    height,
    width,
    itemHeight,
    overscanCount,
    className,
    loading,
    loadingMessage,
    emptyMessage,
    ItemRenderer
  ]);
  return VirtualList;
});
VirtualizedList.displayName = 'VirtualizedList';
export default VirtualizedList;
// Hook for managing virtualized list state
export const useVirtualizedList = (initialItems = [], options = {}) => {
  const {
    filterFn,
    sortFn,
    searchTerm = '',
    itemsPerPage = 50
  } = options;
  const processedItems = useMemo(() => {
    let result = [...initialItems];
    // Apply search filter
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => {
        const searchableText = [
          item.name,
          item.title,
          item.description,
          item.email,
          item.role
        ].filter(Boolean).join(' ').toLowerCase();
        return searchableText.includes(term);
      });
    }
    // Apply custom filter
    if (filterFn) {
      result = result.filter(filterFn);
    }
    // Apply sorting
    if (sortFn) {
      result.sort(sortFn);
    }
    return result;
  }, [initialItems, filterFn, sortFn, searchTerm]);
  const paginatedItems = useMemo(() => {
    return processedItems.slice(0, itemsPerPage);
  }, [processedItems, itemsPerPage]);
  return {
    items: paginatedItems,
    totalItems: processedItems.length,
    hasMore: processedItems.length > itemsPerPage
  };
};
