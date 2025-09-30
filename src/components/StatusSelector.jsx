import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateMemberStatus } from '../redux/slices/membersSlice';
import { Clock, Coffee, Users, UserX, CheckCircle } from 'lucide-react';
const StatusSelector = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.role);
  const { members } = useSelector(state => state.members);
  // Find current user's member data
  const currentMember = members.find(member => member.id === currentUser?.id);
  const statusOptions = [
    {
      value: 'working',
      label: 'Working',
      icon: Clock,
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-green-700 dark:text-green-300',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      description: 'Currently working on tasks'
    },
    {
      value: 'break',
      label: 'On Break',
      icon: Coffee,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      description: 'Taking a short break'
    },
    {
      value: 'meeting',
      label: 'In Meeting',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-blue-700 dark:text-blue-300',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      description: 'Currently in a meeting'
    },
    {
      value: 'offline',
      label: 'Offline',
      icon: UserX,
      color: 'bg-gray-500 hover:bg-gray-600',
      textColor: 'text-gray-700 dark:text-gray-300',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      borderColor: 'border-gray-200 dark:border-gray-800',
      description: 'Not available'
    }
  ];
  const handleStatusChange = (newStatus) => {
    if (currentUser && newStatus !== currentMember?.status) {
      dispatch(updateMemberStatus({ 
        memberId: currentUser.id, 
        status: newStatus 
      }));
    }
  };
  if (!currentUser || !currentMember) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Please select a user role to update status.
        </p>
      </div>
    );
  }
  const currentStatus = statusOptions.find(option => option.value === currentMember.status);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Update Your Status
      </h2>
      {}
      <div className={`p-4 rounded-lg border-2 mb-6 ${currentStatus?.bgColor} ${currentStatus?.borderColor}`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${currentStatus?.color} text-white`}>
            {currentStatus && <currentStatus.icon className="h-5 w-5" />}
          </div>
          <div>
            <h3 className={`font-semibold ${currentStatus?.textColor}`}>
              Current Status: {currentStatus?.label}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentStatus?.description}
            </p>
          </div>
          <CheckCircle className={`h-5 w-5 ml-auto ${currentStatus?.textColor}`} />
        </div>
      </div>
      {}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Choose New Status:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {statusOptions.map((option) => {
            const isCurrentStatus = option.value === currentMember.status;
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                disabled={isCurrentStatus}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${isCurrentStatus 
                    ? `${option.bgColor} ${option.borderColor} cursor-not-allowed opacity-75` 
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${option.color} text-white`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      isCurrentStatus 
                        ? option.textColor 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {option.label}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {option.description}
                    </p>
                  </div>
                  {isCurrentStatus && (
                    <CheckCircle className={`h-5 w-5 ${option.textColor}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Last updated:</span>
          <span>
            {currentMember.lastActivity 
              ? new Date(currentMember.lastActivity).toLocaleString()
              : 'Never'
            }
          </span>
        </div>
      </div>
    </div>
  );
};
export default StatusSelector;
