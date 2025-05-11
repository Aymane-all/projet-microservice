import { useState, useEffect } from 'react'
import { FaPlus, FaSearch, FaEdit, FaTrash, FaSync } from 'react-icons/fa'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import StatusBadge from '../components/ui/StatusBadge'
import Modal, { ConfirmationModal } from '../components/ui/Modal'
import { users as mockUsers } from '../utils/mockData'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'patient',
    phone: '',
    active: true
  })
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    filterUsers()
  }, [searchTerm, roleFilter, statusFilter, users])
  
  const filterUsers = () => {
    let result = [...users]
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(user => 
        user.name.toLowerCase().includes(search) || 
        user.email.toLowerCase().includes(search)
      )
    }
    
    // Apply role filter
    if (roleFilter) {
      result = result.filter(user => user.role === roleFilter)
    }
    
    // Apply status filter
    if (statusFilter) {
      const isActive = statusFilter === 'active'
      result = result.filter(user => user.active === isActive)
    }
    
    setFilteredUsers(result)
  }
  
  const resetFilters = () => {
    setSearchTerm('')
    setRoleFilter('')
    setStatusFilter('')
  }
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }
  
  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      ...formData,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setUsers([newUser, ...users])
    setIsAddModalOpen(false)
    resetForm()
  }
  
  const handleEditUser = () => {
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? { ...user, ...formData } : user
    )
    
    setUsers(updatedUsers)
    setIsEditModalOpen(false)
    resetForm()
  }
  
  const handleDeleteUser = () => {
    const updatedUsers = users.filter(user => user.id !== currentUser.id)
    setUsers(updatedUsers)
    setIsDeleteModalOpen(false)
  }
  
  const handleToggleStatus = (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    )
    
    setUsers(updatedUsers)
  }
  
  const editUser = (user) => {
    setCurrentUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      active: user.active
    })
    setIsEditModalOpen(true)
  }
  
  const deleteUser = (user) => {
    setCurrentUser(user)
    setIsDeleteModalOpen(true)
  }
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'patient',
      phone: '',
      active: true
    })
  }
  
  const columns = [
    { field: 'id', title: 'ID' },
    { field: 'name', title: 'Name' },
    { field: 'email', title: 'Email' },
    { 
      field: 'role', 
      title: 'Role',
      render: (value) => (
        <span className="capitalize">{value}</span>
      )
    },
    { field: 'phone', title: 'Phone' },
    { 
      field: 'active', 
      title: 'Status',
      render: (value) => (
        <StatusBadge status={value ? 'active' : 'inactive'} />
      )
    },
    { field: 'createdAt', title: 'Created At' },
    { 
      field: 'id', 
      title: 'Actions',
      sortable: false,
      render: (_, user) => (
        <div className="flex space-x-2">
          <button 
            className="p-1 text-primary-600 hover:bg-primary-50 rounded"
            onClick={() => editUser(user)}
            title="Edit"
          >
            <FaEdit />
          </button>
          <button 
            className="p-1 text-error-600 hover:bg-error-50 rounded"
            onClick={() => deleteUser(user)}
            title="Delete"
          >
            <FaTrash />
          </button>
          <button 
            className={`p-1 ${user.active ? 'text-error-600 hover:bg-error-50' : 'text-success-600 hover:bg-success-50'} rounded`}
            onClick={() => handleToggleStatus(user.id)}
            title={user.active ? 'Deactivate' : 'Activate'}
          >
            <FaSync />
          </button>
        </div>
      )
    }
  ]
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse-slow text-primary-500 text-lg">
          Loading users...
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <Button 
          variant="primary" 
          onClick={() => {
            resetForm()
            setIsAddModalOpen(true)
          }}
        >
          <FaPlus className="mr-1" /> Add User
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email"
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select 
              className="input"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>
          
          <div className="w-full md:w-1/5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Users Table */}
      <DataTable 
        columns={columns} 
        data={filteredUsers}
        defaultSortField="id"
      />
      
      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
        footer={
          <>
            <Button variant="primary" onClick={handleAddUser}>
              Add User
            </Button>
            <Button variant="outline" className="ml-2" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="input"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="input"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              className="input"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              className="input"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>
        </div>
      </Modal>
      
      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        footer={
          <>
            <Button variant="primary" onClick={handleEditUser}>
              Save Changes
            </Button>
            <Button variant="outline" className="ml-2" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="input"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="input"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              className="input"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              className="input"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="edit-active"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="edit-active" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete user ${currentUser?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="error"
      />
    </div>
  )
}

export default UserManagement