import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../components/notifications/ToastNotifications';
// Network status hook
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');
  const [effectiveType, setEffectiveType] = useState('unknown');
  const [downlink, setDownlink] = useState(0);
  const [rtt, setRtt] = useState(0);
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    const updateConnectionInfo = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
          setConnectionType(connection.type || 'unknown');
          setEffectiveType(connection.effectiveType || 'unknown');
          setDownlink(connection.downlink || 0);
          setRtt(connection.rtt || 0);
        }
      }
    };
    // Initial setup
    updateConnectionInfo();
    // Event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        connection.addEventListener('change', updateConnectionInfo);
      }
    }
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
          connection.removeEventListener('change', updateConnectionInfo);
        }
      }
    };
  }, []);
  return {
    isOnline,
    connectionType,
    effectiveType,
    downlink,
    rtt,
    isSlowConnection: effectiveType === 'slow-2g' || effectiveType === '2g',
    isFastConnection: effectiveType === '4g' || effectiveType === '5g'
  };
};
// Offline storage hook
export const useOfflineStorage = (key, initialValue = null) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(`offline_${key}`);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading offline storage for key ${key}:`, error);
      return initialValue;
    }
  });
  const setStoredValue = useCallback((newValue) => {
    try {
      setValue(newValue);
      if (newValue === null) {
        localStorage.removeItem(`offline_${key}`);
      } else {
        localStorage.setItem(`offline_${key}`, JSON.stringify(newValue));
      }
    } catch (error) {
      console.warn(`Error writing to offline storage for key ${key}:`, error);
    }
  }, [key]);
  const clearStoredValue = useCallback(() => {
    setStoredValue(null);
  }, [setStoredValue]);
  return [value, setStoredValue, clearStoredValue];
};
// Offline queue hook for API requests
export const useOfflineQueue = () => {
  const [queue, setQueue] = useOfflineStorage('api_queue', []);
  const { isOnline } = useNetworkStatus();
  const { success, error, loading } = useToast();
  const processingRef = useRef(false);
  const addToQueue = useCallback((request) => {
    const queueItem = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...request
    };
    setQueue(prev => [...prev, queueItem]);
    return queueItem.id;
  }, [setQueue]);
  const removeFromQueue = useCallback((id) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  }, [setQueue]);
  const processQueue = useCallback(async () => {
    if (!isOnline || processingRef.current || queue.length === 0) {
      return;
    }
    processingRef.current = true;
    const toastId = loading(`Processing ${queue.length} queued requests...`);
    try {
      const results = [];
      for (const item of queue) {
        try {
          const response = await fetch(item.url, {
            method: item.method || 'GET',
            headers: item.headers || {},
            body: item.body ? JSON.stringify(item.body) : undefined
          });
          if (response.ok) {
            results.push({ id: item.id, success: true, response });
            removeFromQueue(item.id);
          } else {
            results.push({ id: item.id, success: false, error: response.statusText });
          }
        } catch (err) {
          results.push({ id: item.id, success: false, error: err.message });
        }
      }
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;
      if (successCount > 0) {
        success(`${successCount} requests processed successfully`);
      }
      if (failureCount > 0) {
        error(`${failureCount} requests failed`);
      }
    } catch (err) {
      error('Failed to process offline queue');
    } finally {
      processingRef.current = false;
    }
  }, [isOnline, queue, removeFromQueue, loading, success, error]);
  // Auto-process queue when coming back online
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      processQueue();
    }
  }, [isOnline, queue.length, processQueue]);
  return {
    queue,
    addToQueue,
    removeFromQueue,
    processQueue,
    queueLength: queue.length
  };
};
// Offline data sync hook
export const useOfflineSync = (syncKey, syncFunction) => {
  const [lastSync, setLastSync] = useOfflineStorage(`last_sync_${syncKey}`, null);
  const [pendingChanges, setPendingChanges] = useOfflineStorage(`pending_${syncKey}`, []);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isOnline } = useNetworkStatus();
  const { success, error, loading } = useToast();
  const addPendingChange = useCallback((change) => {
    const changeWithId = {
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...change
    };
    setPendingChanges(prev => [...prev, changeWithId]);
    return changeWithId.id;
  }, [setPendingChanges]);
  const sync = useCallback(async (force = false) => {
    if (!isOnline || isSyncing) {
      return false;
    }
    if (!force && pendingChanges.length === 0) {
      return true;
    }
    setIsSyncing(true);
    const toastId = loading('Syncing data...');
    try {
      const result = await syncFunction(pendingChanges);
      if (result.success) {
        setPendingChanges([]);
        setLastSync(new Date().toISOString());
        success('Data synced successfully');
        return true;
      } else {
        error(result.error || 'Sync failed');
        return false;
      }
    } catch (err) {
      error(`Sync failed: ${err.message}`);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, pendingChanges, syncFunction, setPendingChanges, setLastSync, loading, success, error]);
  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingChanges.length > 0) {
      sync();
    }
  }, [isOnline, pendingChanges.length, sync]);
  return {
    lastSync,
    pendingChanges,
    isSyncing,
    addPendingChange,
    sync,
    hasPendingChanges: pendingChanges.length > 0
  };
};
// Offline cache hook
export const useOfflineCache = (cacheKey, fetchFunction, options = {}) => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default TTL
    staleWhileRevalidate = true,
    maxAge = 24 * 60 * 60 * 1000 // 24 hours max age
  } = options;
  const [cachedData, setCachedData] = useOfflineStorage(cacheKey, null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isOnline } = useNetworkStatus();
  const isStale = useCallback(() => {
    if (!cachedData || !cachedData.timestamp) return true;
    const age = Date.now() - new Date(cachedData.timestamp).getTime();
    return age > ttl;
  }, [cachedData, ttl]);
  const isExpired = useCallback(() => {
    if (!cachedData || !cachedData.timestamp) return true;
    const age = Date.now() - new Date(cachedData.timestamp).getTime();
    return age > maxAge;
  }, [cachedData, maxAge]);
  const fetchData = useCallback(async (force = false) => {
    if (!isOnline && !force) {
      return cachedData?.data || null;
    }
    if (!force && cachedData && !isStale()) {
      return cachedData.data;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFunction();
      const cacheEntry = {
        data,
        timestamp: new Date().toISOString()
      };
      setCachedData(cacheEntry);
      return data;
    } catch (err) {
      setError(err);
      // Return stale data if available and staleWhileRevalidate is enabled
      if (staleWhileRevalidate && cachedData && !isExpired()) {
        return cachedData.data;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, cachedData, isStale, isExpired, fetchFunction, setCachedData, staleWhileRevalidate]);
  const clearCache = useCallback(() => {
    setCachedData(null);
  }, [setCachedData]);
  return {
    data: cachedData?.data || null,
    isLoading,
    error,
    isStale: isStale(),
    isExpired: isExpired(),
    fetchData,
    clearCache,
    lastUpdated: cachedData?.timestamp || null
  };
};
// Main offline mode hook
export const useOfflineMode = () => {
  const networkStatus = useNetworkStatus();
  const offlineQueue = useOfflineQueue();
  const [offlineData, setOfflineData] = useOfflineStorage('offline_app_data', {});
  const saveOfflineData = useCallback((key, data) => {
    setOfflineData(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: new Date().toISOString()
      }
    }));
  }, [setOfflineData]);
  const getOfflineData = useCallback((key) => {
    return offlineData[key]?.data || null;
  }, [offlineData]);
  const clearOfflineData = useCallback((key) => {
    if (key) {
      setOfflineData(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    } else {
      setOfflineData({});
    }
  }, [setOfflineData]);
  const isDataStale = useCallback((key, maxAge = 60 * 60 * 1000) => {
    const entry = offlineData[key];
    if (!entry || !entry.timestamp) return true;
    const age = Date.now() - new Date(entry.timestamp).getTime();
    return age > maxAge;
  }, [offlineData]);
  return {
    ...networkStatus,
    ...offlineQueue,
    saveOfflineData,
    getOfflineData,
    clearOfflineData,
    isDataStale,
    offlineDataKeys: Object.keys(offlineData)
  };
};
export default useOfflineMode;
