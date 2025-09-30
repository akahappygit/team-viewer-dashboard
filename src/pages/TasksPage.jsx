import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ArrowUp,
  ArrowDown,
  Grid,
  List
} from 'lucide-react';
import { 
  Card, 
  StatsCard, 
  GlassCard, 
  Button, 
  IconButton, 
  Input, 
  SearchInput, 
  Badge, 
  StatusBadge, 
  Dropdown, 
  DropdownItem, 
  Select, 
  Modal 
} from '../components/ui';
import { StaggeredList, FloatingElements } from '../components/animations';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  updateTaskStatus,
  setFilter,
  setSortBy,
  setViewMode,
  setSearchQuery
} from '../redux/slices/tasksSlice';
import { useToast } from '../hooks/useToast';
const TasksPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { taskId } = useParams();
  const {
    tasks,
    filteredTasks,
    loading,
    error,
    filters,
    sortBy,
    viewMode,
    searchQuery,
    analytics
  } = useSelector(state => state.tasks);
  const { user } = useSelector(state => state.auth);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);
  useEffect(() => {
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setSelectedTask(task);
      }
    }
  }, [taskId, tasks]);
  const handleCreateTask = (taskData) => {
    dispatch(createTask(taskData));
    setIsCreateModalOpen(false);
  };
  const handleUpdateTask = (taskData) => {
    dispatch(updateTask({ id: selectedTask.id, updates: taskData }));
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };
  const handleDeleteTask = () => {
    dispatch(deleteTask(selectedTask.id));
    setIsDeleteModalOpen(false);
    setSelectedTask(null);
    if (taskId) {
      navigate('/tasks');
    }
  };
  const handleTaskClick = (task) => {
    navigate(`/tasks/${task.id}`);
  };
  const handleSearchChange = (value) => {
    dispatch(setSearchQuery(value));
  };
  const handleFilterChange = (filterType, value) => {
    dispatch(setFilter({ [filterType]: value }));
  };
  const handleSortChange = (value) => {
    dispatch(setSortBy(value));
  };
  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Circle className="h-4 w-4 text-gray-400" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };
  const filterOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'blocked', label: 'Blocked' }
  ];
  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'title', label: 'Title' }
  ];
  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {}
      <FloatingElements />
      <div className="relative z-10 p-6 space-y-6">
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Task Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Organize and track your team's progress
            </p>
          </div>
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </motion.div>
        </motion.div>
        <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Tasks"
            value={analytics.totalTasks}
            icon={<Circle />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="In Progress"
            value={analytics.inProgress}
            icon={<Clock />}
            trend={{ value: 8, isPositive: true }}
            className="border-blue-200 dark:border-blue-800"
          />
          <StatsCard
            title="Completed"
            value={analytics.completed}
            icon={<CheckCircle2 />}
            trend={{ value: 15, isPositive: true }}
            className="border-green-200 dark:border-green-800"
          />
          <StatsCard
            title="Overdue"
            value={analytics.overdue}
            icon={<AlertCircle />}
            trend={{ value: -3, isPositive: false }}
            className="border-red-200 dark:border-red-800"
          />
        </StaggeredList>
      {}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search tasks..."
              value={searchQuery}
              onSearch={handleSearchChange}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
              options={filterOptions}
              placeholder="Filter by status"
              className="w-40"
            />
            <Select
              value={filters.priority}
              onValueChange={(value) => handleFilterChange('priority', value)}
              options={[{ value: 'all', label: 'All Priorities' }, ...priorityOptions]}
              placeholder="Filter by priority"
              className="w-40"
            />
            <Select
              value={sortBy}
              onValueChange={handleSortChange}
              options={sortOptions}
              placeholder="Sort by"
              className="w-32"
            />
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => handleViewModeChange('list')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Card>
      {}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error Loading Tasks
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchTasks())}>
            Try Again
          </Button>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={`p-4 cursor-pointer hover:shadow-md transition-all ${
                  selectedTask?.id === task.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleTaskClick(task)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.assignee}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <StatusBadge status={task.status} size="sm" />
                        <PriorityBadge priority={task.priority} size="sm" />
                        {task.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Dropdown
                    trigger={
                      <IconButton
                        icon={<MoreHorizontal />}
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    }
                  >
                    <DropdownItem
                      icon={<Eye />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskClick(task);
                      }}
                    >
                      View Details
                    </DropdownItem>
                    <DropdownItem
                      icon={<Edit />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Edit Task
                    </DropdownItem>
                    <DropdownItem
                      icon={<Trash2 />}
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete Task
                    </DropdownItem>
                  </Dropdown>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      {filteredTasks.length === 0 && !loading && (
        <Card className="p-8 text-center">
          <Circle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || filters.status !== 'all' || filters.priority !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first task'
            }
          </p>
          {(!searchQuery && filters.status === 'all' && filters.priority === 'all') && (
            <Button onClick={() => setIsCreateModalOpen(true)} icon={<Plus />}>
              Create Task
            </Button>
          )}
        </Card>
      )}
      {}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        title="Create New Task"
      />
      {}
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleUpdateTask}
        title="Edit Task"
        initialData={selectedTask}
      />
      {}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTask(null);
        }}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete "{selectedTask?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedTask(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTask}
            >
              Delete Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
// Task Modal Component
const TaskModal = ({ isOpen, onClose, onSubmit, title, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    tags: []
  });
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        assignee: initialData.assignee || '',
        priority: initialData.priority || 'medium',
        status: initialData.status || 'pending',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
        tags: initialData.tags || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assignee: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        tags: []
      });
    }
  }, [initialData, isOpen]);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter task title"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="Enter task description"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Assignee"
            name="assignee"
            value={formData.assignee}
            onChange={handleInputChange}
            placeholder="Enter assignee name"
            required
          />
          <Input
            label="Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gradient"
          >
            {initialData ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default TasksPage;
