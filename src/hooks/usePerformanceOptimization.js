import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());
  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef(null);
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );
    observer.observe(target);
    return () => {
      observer.unobserve(target);
    };
  }, [hasIntersected, options]);
  return { targetRef, isIntersecting, hasIntersected };
};

export const useVirtualScrolling = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState(null);
  const visibleItems = useMemo(() => {
    if (!items.length || !itemHeight || !containerHeight) {
      return { startIndex: 0, endIndex: 0, visibleItems: [] };
    }
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length - 1
    );
    return {
      startIndex,
      endIndex,
      visibleItems: items.slice(startIndex, endIndex + 1),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop]);
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);
  return {
    containerRef: setContainerRef,
    visibleItems,
    handleScroll,
    totalHeight: visibleItems.totalHeight,
    offsetY: visibleItems.offsetY
  };
};

export const usePerformanceMonitor = (componentName) => {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());
  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} - Render #${renderCount.current} took ${renderTime.toFixed(2)}ms`);
    }
    startTime.current = performance.now();
  });
  return {
    renderCount: renderCount.current,
    logPerformance: (operation, time) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} - ${operation} took ${time.toFixed(2)}ms`);
      }
    }
  };
};

export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState(null);
  useEffect(() => {
    if ('memory' in performance) {
      const updateMemoryInfo = () => {
        setMemoryInfo({
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        });
      };
      updateMemoryInfo();
      const interval = setInterval(updateMemoryInfo, 5000);
      return () => clearInterval(interval);
    }
  }, []);
  return memoryInfo;
};

export const useOptimizedSearch = (items, searchFields = ['name', 'title']) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const searchIndex = useMemo(() => {
    const index = new Map();
    items.forEach((item, idx) => {
      const searchableText = searchFields
        .map(field => {
          const value = field.split('.').reduce((obj, key) => obj?.[key], item);
          return typeof value === 'string' ? value.toLowerCase() : '';
        })
        .join(' ');
      index.set(idx, searchableText);
    });
    return index;
  }, [items, searchFields]);
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setFilteredItems(items);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const searchTermLower = debouncedSearchTerm.toLowerCase();
    const results = items.filter((_, idx) => {
      const searchableText = searchIndex.get(idx);
      return searchableText.includes(searchTermLower);
    });
    setFilteredItems(results);
    setIsSearching(false);
  }, [debouncedSearchTerm, items, searchIndex]);
  const highlightMatch = useCallback((text, field) => {
    if (!debouncedSearchTerm.trim()) return text;
    const regex = new RegExp(`(${debouncedSearchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }, [debouncedSearchTerm]);
  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    isSearching,
    highlightMatch,
    resultsCount: filteredItems.length,
    hasResults: filteredItems.length > 0
  };
};

export const useBatchOperations = (batchSize = 10, delay = 100) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const processBatch = useCallback(async (items, operation) => {
    setIsProcessing(true);
    setProgress(0);
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    const results = [];
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchResults = await Promise.all(
        batch.map(item => operation(item))
      );
      results.push(...batchResults);
      setProgress(((i + 1) / batches.length) * 100);
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    setIsProcessing(false);
    setProgress(100);
    return results;
  }, [batchSize, delay]);
  return { processBatch, isProcessing, progress };
};

export const useLazyImage = (src, placeholder = '') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { targetRef, hasIntersected } = useIntersectionObserver();
  useEffect(() => {
    if (!hasIntersected || !src) return;
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      setIsError(true);
    };
    img.src = src;
  }, [hasIntersected, src]);
  return { targetRef, imageSrc, isLoaded, isError };
};
