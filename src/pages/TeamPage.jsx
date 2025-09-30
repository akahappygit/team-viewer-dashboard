import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Edit,
  Trash2,
  UserPlus,
  Settings
} from 'lucide-react';
import { 
  useGetAllMembersQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useUpdateMemberStatusMutation
} from '../redux/api/membersApi';
import { Card, StatsCard, GlassCard } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Input, SearchInput } from '../components/ui/Input';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Dropdown, DropdownItem, Select } from '../components/ui/Dropdown';
import { Modal } from '../components/ui/Modal';
import { StaggeredList, FloatingElements } from '../components/animations';
import { TeamPerformanceChart } from '../components/charts';
const TeamPage = () => {
  const dispatch = useDispatch();
  const { data: members = [], isLoading, error, refetch } = useGetAllMembersQuery();
  const [createMember] = useCreateMemberMutation();
  const [updateMember] = useUpdateMemberMutation();
  const [deleteMember] = useDeleteMemberMutation();
  const [updateMemberStatus] = useUpdateMemberStatusMutation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  // Filter members based on search and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });
  // Calculate team statistics
  const teamStats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'active').length,
    departments: [...new Set(members.map(m => m.department))].length,
    avgPerformance: members.reduce((sum, m) => sum + (m.performance || 0), 0) / members.length || 0
  };
  const handleCreateMember = async (memberData) => {
    try {
      await createMember(memberData).unwrap();
      setIsCreateModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to create member:', error);
    }
  };
  const handleUpdateMember = async (memberData) => {
    try {
      await updateMember({ 
        id: selectedMember.id, 
        updates: memberData 
      }).unwrap();
      setIsEditModalOpen(false);
      setSelectedMember(null);
      refetch();
    } catch (error) {
      console.error('Failed to update member:', error);
    }
  };
  const handleDeleteMember = async () => {
    try {
      await deleteMember(selectedMember.id).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedMember(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete member:', error);
    }
  };
  const handleStatusChange = async (memberId, newStatus) => {
    try {
      await updateMemberStatus({ id: memberId, status: newStatus }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update member status:', error);
    }
  };
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'team_lead', label: 'Team Lead' },
    { value: 'senior_developer', label: 'Senior Developer' },
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'qa_engineer', label: 'QA Engineer' }
  ];
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on_leave', label: 'On Leave' }
  ];
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {}
      <FloatingElements />
      <div className="relative z-10 p-6 space-y-6">
        {}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Team Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your team members and track their performance
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
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </motion.div>
        </motion.div>
        {}
        <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Members"
            value={teamStats.totalMembers}
            icon={<Users />}
            trend={{ value: 2, isPositive: true }}
          />
          <StatsCard
            title="Active Members"
            value={teamStats.activeMembers}
            icon={<TrendingUp />}
            trend={{ value: 1, isPositive: true }}
            className="border-green-200 dark:border-green-800"
          />
          <StatsCard
            title="Departments"
            value={teamStats.departments}
            icon={<Settings />}
            className="border-blue-200 dark:border-blue-800"
          />
          <StatsCard
            title="Avg Performance"
            value={`${teamStats.avgPerformance.toFixed(1)}%`}
            icon={<Award />}
            trend={{ value: 3.2, isPositive: true }}
            className="border-purple-200 dark:border-purple-800"
          />
        </StaggeredList>
      {}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search team members..."
              value={searchQuery}
              onSearch={setSearchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              options={roleOptions}
              placeholder="Filter by role"
              className="w-40"
            />
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              options={statusOptions}
              placeholder="Filter by status"
              className="w-36"
            />
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Card>
      {}
      <div className="mb-8">
        <TeamPerformanceChart
          title="Team Performance Analytics"
          type="radar"
          height={350}
          showComparison={false}
          timeframe="month"
        />
      </div>
      {}
      {error ? (
        <Card className="p-8 text-center">
          <Users className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error Loading Team Members
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error.message}</p>
          <Button onClick={refetch}>
            Try Again
          </Button>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === 'grid' ? (
                <GlassCard className="p-6 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {member.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {member.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                      </div>
                    </div>
                    <Dropdown
                      trigger={
                        <IconButton
                          icon={<MoreHorizontal />}
                          variant="ghost"
                          size="sm"
                        />
                      }
                    >
                      <DropdownItem
                        icon={<Users />}
                        onClick={() => {
                          setSelectedMember(member);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        View Details
                      </DropdownItem>
                      <DropdownItem
                        icon={<Edit />}
                        onClick={() => {
                          setSelectedMember(member);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Edit Member
                      </DropdownItem>
                      <DropdownItem
                        icon={<Trash2 />}
                        variant="destructive"
                        onClick={() => {
                          setSelectedMember(member);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        Remove Member
                      </DropdownItem>
                    </Dropdown>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4 mr-2" />
                      {member.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {member.department}
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={member.status} size="sm" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Performance: <span className="font-medium text-gray-900 dark:text-white">
                          {member.performance}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${member.performance}%` }}
                      />
                    </div>
                  </div>
                </GlassCard>
              ) : (
                <Card className="p-4 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </h3>
                          <StatusBadge status={member.status} size="sm" />
                        </div>
                        <div className="flex items-center space-x-6 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <span>{member.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                          <span>{member.department}</span>
                          <span>{member.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.performance}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Performance
                          </div>
                        </div>
                        <div className="w-20">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${member.performance}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <Dropdown
                      trigger={
                        <IconButton
                          icon={<MoreHorizontal />}
                          variant="ghost"
                          size="sm"
                        />
                      }
                    >
                      <DropdownItem
                        icon={<Users />}
                        onClick={() => {
                          setSelectedMember(member);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        View Details
                      </DropdownItem>
                      <DropdownItem
                        icon={<Edit />}
                        onClick={() => {
                          setSelectedMember(member);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Edit Member
                      </DropdownItem>
                      <DropdownItem
                        icon={<Trash2 />}
                        variant="destructive"
                        onClick={() => {
                          setSelectedMember(member);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        Remove Member
                      </DropdownItem>
                    </Dropdown>
                  </div>
                </Card>
              )}
            </motion.div>
          ))}
        </div>
      )}
      {filteredMembers.length === 0 && !isLoading && (
        <Card className="p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No team members found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || selectedRole !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first team member'
            }
          </p>
          {(!searchQuery && selectedRole === 'all' && selectedStatus === 'all') && (
            <Button onClick={() => setIsCreateModalOpen(true)} icon={<UserPlus />}>
              Add Team Member
            </Button>
          )}
        </Card>
      )}
      {}
      <MemberModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMember}
        title="Add New Team Member"
      />
      <MemberModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
        }}
        onSubmit={handleUpdateMember}
        title="Edit Team Member"
        initialData={selectedMember}
      />
      <MemberDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
      />
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMember(null);
        }}
        title="Remove Team Member"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to remove "{selectedMember?.name}" from the team? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedMember(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMember}
            >
              Remove Member
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
// Member Modal Component
const MemberModal = ({ isOpen, onClose, onSubmit, title, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'developer',
    department: '',
    status: 'active',
    phone: '',
    location: ''
  });
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        role: initialData.role || 'developer',
        department: initialData.department || '',
        status: initialData.status || 'active',
        phone: initialData.phone || '',
        location: initialData.location || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'developer',
        department: '',
        status: 'active',
        phone: '',
        location: ''
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
            required
          />
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email address"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="team_lead">Team Lead</option>
              <option value="senior_developer">Senior Developer</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="qa_engineer">QA Engineer</option>
            </select>
          </div>
          <Input
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            placeholder="Enter department"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
          />
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter location"
          />
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
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
            {initialData ? 'Update Member' : 'Add Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
// Member Detail Modal Component
const MemberDetailModal = ({ isOpen, onClose, member }) => {
  if (!member) return null;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Team Member Details"
      size="lg"
    >
      <div className="space-y-6">
        {}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-medium">
            {member.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {member.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {member.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
            <StatusBadge status={member.status} className="mt-1" />
          </div>
        </div>
        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Contact Information</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                {member.email}
              </div>
              {member.phone && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  {member.phone}
                </div>
              )}
              {member.location && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  {member.location}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Work Information</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4 mr-2" />
                {member.department}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                Joined {new Date(member.joinDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        {}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-white">Performance Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {member.performance}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Overall Performance
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {member.tasksCompleted || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Tasks Completed
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {member.efficiency || 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Efficiency Rate
              </div>
            </div>
          </div>
        </div>
        {}
        {member.skills && member.skills.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
export default TeamPage;
