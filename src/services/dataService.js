import cacheService, { createCacheKey } from './cacheService.js';
import { generateMockData } from '../data/mockData.js';
// Data service with integrated caching and mock data
class DataService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.mockMode = process.env.REACT_APP_USE_MOCK_DATA !== 'false';
    this.requestQueue = [];
    this.isOnline = navigator.onLine;
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
  // Generic API request with caching
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      data = null,
      cache = true,
      cacheTTL = 5 * 60 * 1000, // 5 minutes
      persistent = false,
      staleWhileRevalidate = false,
      tags = []
    } = options;
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = createCacheKey('api', method, endpoint, JSON.stringify(data));
    // For GET requests, try cache first
    if (method === 'GET' && cache) {
      const cachedData = cacheService.get(cacheKey, { persistent });
      if (cachedData) {
        // If stale-while-revalidate, return cached data but refresh in background
        if (staleWhileRevalidate && cacheService.isStale(cacheKey, { staleThreshold: cacheTTL * 0.8 })) {
          this.refreshInBackground(endpoint, options);
        }
        return cachedData;
      }
    }
    // If offline, return cached data or queue request
    if (!this.isOnline) {
      if (method === 'GET') {
        const cachedData = cacheService.get(cacheKey, { persistent: true });
        if (cachedData) {
          return cachedData;
        }
        throw new Error('No cached data available offline');
      } else {
        // Queue non-GET requests for when we're back online
        return this.queueRequest(endpoint, options);
      }
    }
    try {
      let response;
      if (this.mockMode) {
        // Use mock data
        response = await this.getMockResponse(endpoint, method, data);
      } else {
        // Make real API request
        const fetchOptions = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          }
        };
        if (data && method !== 'GET') {
          fetchOptions.body = JSON.stringify(data);
        }
        const fetchResponse = await fetch(url, fetchOptions);
        if (!fetchResponse.ok) {
          throw new Error(`HTTP error! status: ${fetchResponse.status}`);
        }
        response = await fetchResponse.json();
      }
      // Cache successful GET responses
      if (method === 'GET' && cache) {
        cacheService.set(cacheKey, response, {
          ttl: cacheTTL,
          persistent,
          tags: ['api', ...tags]
        });
      }
      return response;
    } catch (error) {
      // If request fails, try to return stale cached data
      if (method === 'GET' && cache) {
        const staleData = cacheService.get(cacheKey, { persistent: true });
        if (staleData) {
          console.warn(`API request failed for ${endpoint}, returning stale data:`, error);
          return staleData;
        }
      }
      throw error;
    }
  }
  // Mock response generator
  async getMockResponse(endpoint, method, data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
    const mockData = generateMockData();
    // Route mock responses based on endpoint
    switch (true) {
      case endpoint.includes('/dashboard/stats'):
        return {
          totalMembers: mockData.teamMembers.length,
          activeProjects: mockData.projects.filter(p => p.status === 'active').length,
          completedTasks: mockData.tasks.filter(t => t.status === 'completed').length,
          pendingTasks: mockData.tasks.filter(t => t.status === 'pending').length,
          teamEfficiency: mockData.performanceMetrics.teamEfficiency,
          projectProgress: mockData.performanceMetrics.projectProgress
        };
      case endpoint.includes('/team/members'):
        if (method === 'POST') {
          const newMember = { ...data, id: Date.now(), joinDate: new Date().toISOString() };
          return newMember;
        }
        return mockData.teamMembers;
      case endpoint.includes('/projects'):
        if (method === 'POST') {
          const newProject = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
          return newProject;
        }
        return mockData.projects;
      case endpoint.includes('/tasks'):
        if (method === 'POST') {
          const newTask = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
          return newTask;
        }
        return mockData.tasks;
      case endpoint.includes('/performance/metrics'):
        return mockData.performanceMetrics;
      case endpoint.includes('/performance/trends'):
        return mockData.performanceMetrics.trends;
      case endpoint.includes('/notifications'):
        return mockData.notifications || [];
      case endpoint.includes('/activities'):
        return mockData.activities || [];
      default:
        throw new Error(`Mock endpoint not implemented: ${endpoint}`);
    }
  }
  // Queue requests for offline processing
  async queueRequest(endpoint, options) {
    const queueItem = {
      id: Date.now(),
      endpoint,
      options,
      timestamp: Date.now()
    };
    this.requestQueue.push(queueItem);
    // Store in persistent cache for recovery
    cacheService.set('offline_queue', this.requestQueue, { persistent: true });
    return { queued: true, id: queueItem.id };
  }
  // Process queued requests when back online
  async processQueue() {
    const queue = [...this.requestQueue];
    this.requestQueue = [];
    for (const item of queue) {
      try {
        await this.request(item.endpoint, { ...item.options, cache: false });
      } catch (error) {
        console.error('Failed to process queued request:', error);
        // Re-queue failed requests
        this.requestQueue.push(item);
      }
    }
    // Update persistent cache
    cacheService.set('offline_queue', this.requestQueue, { persistent: true });
  }
  // Refresh data in background
  async refreshInBackground(endpoint, options) {
    try {
      await this.request(endpoint, { ...options, cache: false });
    } catch (error) {
      console.warn(`Background refresh failed for ${endpoint}:`, error);
    }
  }
  // Specific API methods
  async getDashboardStats() {
    return this.request('/dashboard/stats', {
      cache: true,
      cacheTTL: 2 * 60 * 1000, // 2 minutes
      staleWhileRevalidate: true,
      tags: ['dashboard', 'stats']
    });
  }
  async getTeamMembers() {
    return this.request('/team/members', {
      cache: true,
      cacheTTL: 10 * 60 * 1000, // 10 minutes
      persistent: true,
      tags: ['team', 'members']
    });
  }
  async addTeamMember(memberData) {
    const result = await this.request('/team/members', {
      method: 'POST',
      data: memberData,
      cache: false
    });
    // Invalidate related caches
    cacheService.clearByTags(['team', 'members', 'dashboard']);
    return result;
  }
  async getProjects() {
    return this.request('/projects', {
      cache: true,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      persistent: true,
      tags: ['projects']
    });
  }
  async addProject(projectData) {
    const result = await this.request('/projects', {
      method: 'POST',
      data: projectData,
      cache: false
    });
    // Invalidate related caches
    cacheService.clearByTags(['projects', 'dashboard']);
    return result;
  }
  async getTasks(filters = {}) {
    const endpoint = '/tasks' + (Object.keys(filters).length ? `?${new URLSearchParams(filters)}` : '');
    return this.request(endpoint, {
      cache: true,
      cacheTTL: 3 * 60 * 1000, // 3 minutes
      staleWhileRevalidate: true,
      tags: ['tasks']
    });
  }
  async addTask(taskData) {
    const result = await this.request('/tasks', {
      method: 'POST',
      data: taskData,
      cache: false
    });
    // Invalidate related caches
    cacheService.clearByTags(['tasks', 'dashboard']);
    return result;
  }
  async updateTask(taskId, updates) {
    const result = await this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      data: updates,
      cache: false
    });
    // Invalidate related caches
    cacheService.clearByTags(['tasks', 'dashboard']);
    return result;
  }
  async getPerformanceMetrics() {
    return this.request('/performance/metrics', {
      cache: true,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      staleWhileRevalidate: true,
      tags: ['performance', 'metrics']
    });
  }
  async getPerformanceTrends(period = '30d') {
    return this.request(`/performance/trends?period=${period}`, {
      cache: true,
      cacheTTL: 10 * 60 * 1000, // 10 minutes
      persistent: true,
      tags: ['performance', 'trends']
    });
  }
  async getNotifications() {
    return this.request('/notifications', {
      cache: true,
      cacheTTL: 1 * 60 * 1000, // 1 minute
      tags: ['notifications']
    });
  }
  async getActivities(limit = 50) {
    return this.request(`/activities?limit=${limit}`, {
      cache: true,
      cacheTTL: 2 * 60 * 1000, // 2 minutes
      tags: ['activities']
    });
  }
  // Bulk operations
  async bulkUpdateTasks(updates) {
    const result = await this.request('/tasks/bulk', {
      method: 'PUT',
      data: { updates },
      cache: false
    });
    // Invalidate related caches
    cacheService.clearByTags(['tasks', 'dashboard']);
    return result;
  }
  async bulkDeleteTasks(taskIds) {
    const result = await this.request('/tasks/bulk', {
      method: 'DELETE',
      data: { ids: taskIds },
      cache: false
    });
    // Invalidate related caches
    cacheService.clearByTags(['tasks', 'dashboard']);
    return result;
  }
  // Data export
  async exportData(type, format = 'json', filters = {}) {
    const endpoint = `/export/${type}?format=${format}&${new URLSearchParams(filters)}`;
    return this.request(endpoint, {
      cache: false,
      headers: {
        'Accept': format === 'csv' ? 'text/csv' : 'application/json'
      }
    });
  }
  // Search with caching
  async search(query, type = 'all', options = {}) {
    const cacheKey = createCacheKey('search', type, query, JSON.stringify(options));
    return cacheService.getOrFetch(cacheKey, async () => {
      return this.request('/search', {
        method: 'POST',
        data: { query, type, ...options },
        cache: false
      });
    }, {
      ttl: 5 * 60 * 1000, // 5 minutes
      tags: ['search']
    });
  }
  // Cache management
  clearCache(tags = null) {
    if (tags) {
      cacheService.clearByTags(tags);
    } else {
      cacheService.clear();
    }
  }
  getCacheStats() {
    return cacheService.getStats();
  }
  // Preload critical data
  async preloadCriticalData() {
    const criticalEndpoints = [
      { method: 'getDashboardStats', priority: 1 },
      { method: 'getTeamMembers', priority: 2 },
      { method: 'getProjects', priority: 2 },
      { method: 'getTasks', priority: 3 }
    ];
    // Load in priority order
    for (const { method } of criticalEndpoints.sort((a, b) => a.priority - b.priority)) {
      try {
        await this[method]();
      } catch (error) {
        console.warn(`Failed to preload ${method}:`, error);
      }
    }
  }
}
// Create singleton instance
const dataService = new DataService();
export default dataService;
// Export for testing
export { DataService };
