import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateMemberStatus } from '../redux/slices/membersSlice';
import { Clock, CheckCircle, AlertCircle, User, Calendar } from 'lucide-react';
const MemberCard = ({ member }) => {
  const dispatch = useDispatch();
  const { currentRole } = useSelector(state => state.role);
  const getStatusIcon = (status) => {
    switch (status) {
      case 'working':
        return <Clock className="h-4 w-4 text-green-500" />;
      case 'break':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'meeting':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'offline':
        return <User className="h-4 w-4 text-gray-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'working':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'break':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'meeting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'offline':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  const handleStatusChange = (newStatus) => {
    dispatch(updateMemberStatus({ memberId: member.id, status: newStatus }));
  };
  const activeTasks = member.tasks?.filter(task => !task.completed) || [];
  const completedTasks = member.tasks?.filter(task => task.completed) || [];
  const averageProgress = member.tasks?.length > 0 
    ? Math.round(member.tasks.reduce((sum, task) => sum + task.progress, 0) / member.tasks.length)
    : 0;
  const formatLastActivity = (lastActivity) => {
    const date = new Date(lastActivity);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      {}
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
            {getStatusIcon(member.status)}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {member.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {member.email}
          </p>
        </div>
      </div>
      {}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
          {getStatusIcon(member.status)}
          <span className="ml-1 capitalize">{member.status}</span>
        </span>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="h-3 w-3 mr-1" />
          {formatLastActivity(member.lastActivity)}
        </div>
      </div>
      {}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-500">
            {member.tasks?.length || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total Tasks
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-500">
            {completedTasks.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Completed
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-500">
            {activeTasks.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Active
          </p>
        </div>
      </div>
      {}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Average Progress</span>
          <span className="text-gray-900 dark:text-white font-medium">{averageProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${averageProgress}%` }}
          ></div>
        </div>
      </div>
      {}
      {currentRole === 'lead' && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Update Status:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleStatusChange('working')}
              disabled={member.status === 'working'}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                member.status === 'working'
                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-green-900 dark:hover:text-green-200'
              }`}
            >
              Working
            </button>
            <button
              onClick={() => handleStatusChange('break')}
              disabled={member.status === 'break'}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                member.status === 'break'
                  ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-yellow-900 dark:hover:text-yellow-200'
              }`}
            >
              Break
            </button>
            <button
              onClick={() => handleStatusChange('meeting')}
              disabled={member.status === 'meeting'}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                member.status === 'meeting'
                  ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900 dark:hover:text-blue-200'
              }`}
            >
              Meeting
            </button>
            <button
              onClick={() => handleStatusChange('offline')}
              disabled={member.status === 'offline'}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                member.status === 'offline'
                  ? 'bg-gray-100 text-gray-800 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Offline
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default MemberCard;
