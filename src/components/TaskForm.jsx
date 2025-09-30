import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { assignTask } from '../redux/slices/membersSlice';
import { Plus, Calendar, User } from 'lucide-react';
const TaskForm = () => {
  const dispatch = useDispatch();
  const { members } = useSelector(state => state.members);
  const [formData, setFormData] = useState({
    memberId: '',
    title: '',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.memberId) {
      newErrors.memberId = 'Please select a team member';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const task = {
        title: formData.title.trim(),
        dueDate: formData.dueDate
      };
      dispatch(assignTask({
        memberId: parseInt(formData.memberId),
        task
      }));
      // Reset form
      setFormData({
        memberId: '',
        title: '',
        dueDate: ''
      });
      // Show success message (you could add a toast notification here)
      console.log('Task assigned successfully!');
    } catch (error) {
      console.error('Error assigning task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  const getSelectedMember = () => {
    return members.find(member => member.id === parseInt(formData.memberId));
  };
  return (
    <div className="card p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Plus className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Assign New Task
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <User className="h-4 w-4 inline mr-1" />
            Assign to Team Member
          </label>
          <select
            name="memberId"
            value={formData.memberId}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.memberId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a team member...</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.status})
              </option>
            ))}
          </select>
          {errors.memberId && (
            <p className="mt-1 text-sm text-red-600">{errors.memberId}</p>
          )}
        </div>
        {}
        <div>
          <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Task Title
          </label>
          <input
            id="task-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter task description..."
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'task-title-error' : undefined}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p id="task-title-error" className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
        {}
        <div>
          <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Due Date
          </label>
          <input
            id="due-date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            min={getMinDate()}
            aria-invalid={!!errors.dueDate}
            aria-describedby={errors.dueDate ? 'due-date-error' : undefined}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.dueDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dueDate && (
            <p id="due-date-error" className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
          )}
        </div>
        {}
        {getSelectedMember() && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Assigning to:</strong> {getSelectedMember().name}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300">
              Current status: {getSelectedMember().status} • 
              Active tasks: {getSelectedMember().tasks.filter(t => t.progress < 100).length}
            </p>
          </div>
        )}
        {}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full btn-primary ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Assigning Task...' : 'Assign Task'}
        </button>
      </form>
    </div>
  );
};
export default TaskForm;
