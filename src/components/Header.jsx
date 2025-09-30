import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { switchRole } from '../redux/slices/roleSlice';
import { toggleDarkMode, setFilter } from '../redux/slices/membersSlice';
import { Moon, Sun, Users, User, Filter, BarChart3 } from 'lucide-react';
const Header = () => {
  const dispatch = useDispatch();
  const { currentRole, currentUser } = useSelector(state => state.role);
  const { darkMode, filters } = useSelector(state => state.members);
  const handleRoleSwitch = () => {
    const newRole = currentRole === 'member' ? 'lead' : 'member';
    dispatch(switchRole(newRole));
  };
  const handleFilterChange = (filterType, value) => {
    dispatch(setFilter({ filterType, value }));
  };
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Team Pulse Dashboard
              </h1>
            </div>
          </div>
          
          {currentRole === 'lead' && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="working">Working</option>
                  <option value="break">On Break</option>
                  <option value="meeting">In Meeting</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="name">Name</option>
                  <option value="tasks">Active Tasks</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {currentRole}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleRoleSwitch}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {currentRole === 'lead' ? (
                <>
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Switch to Member</span>
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Switch to Lead</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
