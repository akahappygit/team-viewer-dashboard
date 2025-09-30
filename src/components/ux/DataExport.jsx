import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Table, 
  Image, 
  FileSpreadsheet,
  Filter,
  Calendar,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader,
  X
} from 'lucide-react';
import { useToast } from '../notifications/ToastNotifications';
import dataService from '../../services/dataService';
// Export formats configuration
const EXPORT_FORMATS = {
  json: {
    id: 'json',
    name: 'JSON',
    icon: FileText,
    description: 'JavaScript Object Notation',
    mimeType: 'application/json',
    extension: 'json'
  },
  csv: {
    id: 'csv',
    name: 'CSV',
    icon: Table,
    description: 'Comma Separated Values',
    mimeType: 'text/csv',
    extension: 'csv'
  },
  excel: {
    id: 'excel',
    name: 'Excel',
    icon: FileSpreadsheet,
    description: 'Microsoft Excel Spreadsheet',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: 'xlsx'
  },
  pdf: {
    id: 'pdf',
    name: 'PDF',
    icon: FileText,
    description: 'Portable Document Format',
    mimeType: 'application/pdf',
    extension: 'pdf'
  }
};
// Data types that can be exported
const DATA_TYPES = {
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard Stats',
    description: 'Overall dashboard statistics and metrics'
  },
  members: {
    id: 'members',
    name: 'Team Members',
    description: 'Team member information and details'
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    description: 'Project data and progress information'
  },
  tasks: {
    id: 'tasks',
    name: 'Tasks',
    description: 'Task details and status information'
  },
  performance: {
    id: 'performance',
    name: 'Performance Metrics',
    description: 'Performance analytics and trends'
  },
  activities: {
    id: 'activities',
    name: 'Activities',
    description: 'Activity logs and history'
  }
};
// Date range presets
const DATE_PRESETS = {
  today: { label: 'Today', days: 0 },
  week: { label: 'Last 7 days', days: 7 },
  month: { label: 'Last 30 days', days: 30 },
  quarter: { label: 'Last 3 months', days: 90 },
  year: { label: 'Last year', days: 365 },
  all: { label: 'All time', days: null }
};
// Main export component
export const DataExport = ({ 
  isOpen, 
  onClose, 
  defaultDataType = 'dashboard',
  defaultFormat = 'json',
  className = ''
}) => {
  const [selectedDataType, setSelectedDataType] = useState(defaultDataType);
  const [selectedFormat, setSelectedFormat] = useState(defaultFormat);
  const [dateRange, setDateRange] = useState('month');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });
  const [filters, setFilters] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [compressionEnabled, setCompressionEnabled] = useState(false);
  const { showToast } = useToast();
  // Calculate date range
  const getDateRange = useCallback(() => {
    if (dateRange === 'custom') {
      return {
        start: customDateRange.start,
        end: customDateRange.end
      };
    }
    const preset = DATE_PRESETS[dateRange];
    if (preset.days === null) {
      return {}; // All time
    }
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - preset.days);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  }, [dateRange, customDateRange]);
  // Handle export
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setExportProgress(0);
    try {
      const exportOptions = {
        format: selectedFormat,
        dateRange: getDateRange(),
        filters,
        includeMetadata,
        compression: compressionEnabled
      };
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      // Export data
      const result = await dataService.exportData(selectedDataType, selectedFormat, exportOptions);
      clearInterval(progressInterval);
      setExportProgress(100);
      // Create and download file
      const formatConfig = EXPORT_FORMATS[selectedFormat];
      const blob = new Blob([result], { type: formatConfig.mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedDataType}_export_${new Date().toISOString().split('T')[0]}.${formatConfig.extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Export completed successfully', 'success');
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      showToast(`Export failed: ${error.message}`, 'error');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [selectedDataType, selectedFormat, getDateRange, filters, includeMetadata, compressionEnabled, showToast, onClose]);
  // Estimated file size
  const estimatedSize = useMemo(() => {
    const baseSize = {
      dashboard: 50,
      members: 200,
      projects: 300,
      tasks: 500,
      performance: 150,
      activities: 800
    };
    const formatMultiplier = {
      json: 1,
      csv: 0.7,
      excel: 1.5,
      pdf: 2
    };
    const size = (baseSize[selectedDataType] || 100) * (formatMultiplier[selectedFormat] || 1);
    if (size < 1024) {
      return `${Math.round(size)} KB`;
    } else {
      return `${(size / 1024).toFixed(1)} MB`;
    }
  }, [selectedDataType, selectedFormat]);
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Export Data
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Data Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(DATA_TYPES).map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedDataType(type.id)}
                    className={`
                      p-3 rounded-lg border text-left transition-all duration-200
                      ${selectedDataType === type.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {type.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {type.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(EXPORT_FORMATS).map((format) => {
                  const Icon = format.icon;
                  return (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`
                        p-3 rounded-lg border text-left transition-all duration-200 flex items-center gap-3
                        ${selectedFormat === format.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {format.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {format.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Date Range
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {Object.entries(DATE_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => setDateRange(key)}
                    className={`
                      px-3 py-2 rounded-md text-sm transition-colors duration-200
                      ${dateRange === key
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  onClick={() => setDateRange('custom')}
                  className={`
                    px-3 py-2 rounded-md text-sm transition-colors duration-200
                    ${dateRange === 'custom'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  Custom
                </button>
              </div>
              {dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Export Options
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeMetadata}
                    onChange={(e) => setIncludeMetadata(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Include metadata and timestamps
                  </span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={compressionEnabled}
                    onChange={(e) => setCompressionEnabled(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Enable compression (reduces file size)
                  </span>
                </label>
              </div>
            </div>
            {}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Estimated file size:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {estimatedSize}
                </span>
              </div>
            </div>
            {}
            {isExporting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Exporting...
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {exportProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${exportProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>
          {}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors duration-200 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export Data
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
// Quick export button
export const QuickExportButton = ({ 
  dataType, 
  format = 'json', 
  className = '',
  ...props 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToast();
  const handleQuickExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const result = await dataService.exportData(dataType, format);
      const formatConfig = EXPORT_FORMATS[format];
      const blob = new Blob([result], { type: formatConfig.mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${dataType}_export_${new Date().toISOString().split('T')[0]}.${formatConfig.extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Export completed successfully', 'success');
    } catch (error) {
      console.error('Quick export failed:', error);
      showToast(`Export failed: ${error.message}`, 'error');
    } finally {
      setIsExporting(false);
    }
  }, [dataType, format, showToast]);
  return (
    <button
      onClick={handleQuickExport}
      disabled={isExporting}
      className={`
        flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 
        dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 
        rounded-md transition-colors duration-200 disabled:opacity-50
        ${className}
      `}
      {...props}
    >
      {isExporting ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      Export {format.toUpperCase()}
    </button>
  );
};
export default DataExport;
