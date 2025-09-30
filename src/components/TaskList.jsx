import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTaskProgress } from '../redux/slices/membersSlice';
import { Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
const TaskList = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.role);
  const { members } = useSelector(state => state.members);
  // Find current user's tasks
  const currentMember = members.find(member => member.id === currentUser?.id);
  const tasks = currentMember?.tasks || [];
  const handleProgressUpdate = (taskId, newProgress) => {
    dispatch(updateTaskProgress({ 
      memberId: currentUser.id, 
      taskId, 
      progress: newProgress 
    }));
  };
  const formatDueDate = (dueDate) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffInDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    if (diffInDays < 0) return 'Overdue';
    if (diffInDays === 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    return `Due in ${diffInDays} days`;
  };
  const getDueDateColor = (dueDate) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffInDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    if (diffInDays < 0) return 'text-red-600 dark:text-red-400';
    if (diffInDays <= 1) return 'text-orange-600 dark:text-orange-400';
    if (diffInDays <= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };
  if (!currentUser) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Please select a user role to view tasks.
        </p>
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tasks assigned
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You don't have any tasks assigned yet. Check back later!
          </p>
        </div>
      </div>
    );
  }
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  return (
    <div className="space-y-6">
      {}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          My Tasks
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-500">{tasks.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-500">{activeTasks.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">{completedTasks.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
          </div>
        </div>
      </div>
      {}
      {activeTasks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Active Tasks ({activeTasks.length})
          </h3>
          <div className="space-y-4">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className={getDueDateColor(task.dueDate)}>
                          {formatDueDate(task.dueDate)}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority} priority
                      </span>
                    </div>
                  </div>
                </div>
                {}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {task.progress}%
                    </span>
                  </div>
                  {}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(task.progress)}`}
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  {}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Update progress:
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={task.progress}
                      onChange={(e) => handleProgressUpdate(task.id, parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <div className="flex space-x-1">
                      {[25, 50, 75, 100].map((value) => (
                        <button
                          key={value}
                          onClick={() => handleProgressUpdate(task.id, value)}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            task.progress === value
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {value}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {}
      {completedTasks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Completed Tasks ({completedTasks.length})
          </h3>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>Completed on {new Date(task.completedAt || task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  100%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default TaskList;
