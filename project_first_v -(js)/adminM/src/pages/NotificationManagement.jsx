import { useState, useEffect } from 'react'
import { FaPlus, FaSearch, FaEye, FaTrash, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import StatusBadge from '../components/ui/StatusBadge'
import Modal, { ConfirmationModal } from '../components/ui/Modal'
import { notifications as mockNotifications, users as mockUsers } from '../utils/mockData'

function NotificationManagement() {
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [readFilter, setReadFilter] = useState('')
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentNotification, setCurrentNotification] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    type: '',
    userId: '',
    message: ''
  })
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setNotifications(mockNotifications)
      setFilteredNotifications(mockNotifications)
      setUsers(mockUsers.filter(user => user.active))
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    filterNotifications()
  }, [searchTerm, typeFilter, readFilter, notifications])
  
  const filterNotifications = () => {
    let result = [...notifications]
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(notification => 
        notification.userName.toLowerCase().includes(search) || 
        notification.message.toLowerCase().includes(search)
      )
    }
    
    // Apply type filter
    if (typeFilter) {
      result = result.filter(notification => notification.type === typeFilter)
    }
    
    // Apply read filter
    if (readFilter) {
      const isRead = readFilter === 'read'
      result = result.filter(notification => notification.read === isRead)
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => {
      return new Date(b.sentAt) - new Date(a.sentAt)
    })
    
    setFilteredNotifications(result)
  }
  
  const resetFilters = () => {
    setSearchTerm('')
    setTypeFilter('')
    setReadFilter('')
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleAddNotification = () => {
    const user = users.find(u => u.id === parseInt(formData.userId))
    
    const newNotification = {
      id: notifications.length + 1,
      type: formData.type,
      userId: parseInt(formData.userId),
      userName: user?.name || 'Unknown User',
      message: formData.message,
      read: false,
      sentAt: new Date().toISOString().split('T')[0]
    }
    
    setNotifications([newNotification, ...notifications])
    setIsAddModalOpen(false)
    resetForm()
  }
  
  const handleDeleteNotification = () => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== currentNotification.id
    )
    setNotifications(updatedNotifications)
    setIsDeleteModalOpen(false)
  }
  
  const handleToggleRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: !notification.read } 
        : notification
    )
    
    setNotifications(updatedNotifications)
  }
  
  const viewNotification = (notification) => {
    // Mark as read when viewing
    if (!notification.read) {
      handleToggleRead(notification.id)
    }
    
    setCurrentNotification(notification)
    setIsViewModalOpen(true)
  }
  
  const deleteNotification = (notification) => {
    setCurrentNotification(notification)
    setIsDeleteModalOpen(true)
  }
  
  const resetForm = () => {
    setFormData({
      type: '',
      userId: '',
      message: ''
    })
  }
  
  // Get notification types
  const notificationTypes = [
    'appointment_reminder',
    'appointment_confirmation',
    'appointment_cancellation',
    'doctor_available',
    'test_results'
  ]
  
  // Format notification type for display
  const formatType = (type) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  const columns = [
    { field: 'id', title: 'ID' },
    { 
      field: 'type', 
      title: 'Type',
      render: (value) => formatType(value)
    },
    { field: 'userName', title: 'Recipient' },
    { 
      field: 'message', 
      title: 'Message',
      render: (value) => (
        <div className="truncate max-w-xs">{value}</div>
      )
    },
    { field: 'sentAt', title: 'Sent At' },
    { 
      field: 'read', 
      title: 'Status',
      render: (value) => (
        <StatusBadge status={value ? 'read' : 'unread'} />
      )
    },
    { 
      field: 'id', 
      title: 'Actions',
      sortable: false,
      render: (_, notification) => (
        <div className="flex space-x-2">
          <button 
            className="p-1 text-primary-600 hover:bg-primary-50 rounded"
            onClick={() => viewNotification(notification)}
            title="View"
          >
            <FaEye />
          </button>
          <button 
            className="p-1 text-primary-600 hover:bg-primary-50 rounded"
            onClick={() => handleToggleRead(notification.id)}
            title={notification.read ? 'Mark as Unread' : 'Mark as Read'}
          >
            {notification.read ? <FaEnvelopeOpen /> : <FaEnvelope />}
          </button>
          <button 
            className="p-1 text-error-600 hover:bg-error-50 rounded"
            onClick={() => deleteNotification(notification)}
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ]
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse-slow text-primary-500 text-lg">
          Loading notifications...
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Notification Management</h1>
        <Button 
          variant="primary" 
          onClick={() => {
            resetForm()
            setIsAddModalOpen(true)
          }}
        >
          <FaPlus className="mr-1" /> Send New Notification
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
                placeholder="Search by recipient or message"
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              className="input"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              {notificationTypes.map(type => (
                <option key={type} value={type}>
                  {formatType(type)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="input"
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
          </div>
          
          <div>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Notifications Table */}
      <DataTable 
        columns={columns} 
        data={filteredNotifications}
        defaultSortField="sentAt"
        defaultSortDirection="desc"
      />
      
      {/* Add Notification Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Send New Notification"
        footer={
          <>
            <Button 
              variant="primary" 
              onClick={handleAddNotification}
              disabled={!formData.type || !formData.userId || !formData.message}
            >
              Send Notification
            </Button>
            <Button variant="outline" className="ml-2" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              name="type"
              className="input"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Type</option>
              {notificationTypes.map(type => (
                <option key={type} value={type}>
                  {formatType(type)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
            <select
              name="userId"
              className="input"
              value={formData.userId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Recipient</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="message"
              rows="4"
              className="input"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter notification message"
              required
            />
          </div>
        </div>
      </Modal>
      
      {/* View Notification Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Notification Details"
        footer={
          <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
        }
      >
        {currentNotification && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">
                  {formatType(currentNotification.type)}
                </h3>
                <p className="text-sm text-gray-500">
                  Notification #{currentNotification.id}
                </p>
              </div>
              <StatusBadge 
                status={currentNotification.read ? 'read' : 'unread'} 
              />
            </div>
            
            <div>
              <div className="text-sm text-gray-500">Recipient</div>
              <div className="font-medium">{currentNotification.userName}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500">Message</div>
              <div className="bg-gray-50 p-3 rounded mt-1">
                {currentNotification.message}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500">Sent At</div>
              <div className="font-medium">{currentNotification.sentAt}</div>
            </div>
            
            <div className="pt-2 flex space-x-2">
              <Button 
                variant={currentNotification.read ? 'outline' : 'primary'} 
                size="sm"
                onClick={() => {
                  handleToggleRead(currentNotification.id)
                  setIsViewModalOpen(false)
                }}
              >
                {currentNotification.read ? 
                  <>
                    <FaEnvelope className="mr-1" /> Mark as Unread
                  </> : 
                  <>
                    <FaEnvelopeOpen className="mr-1" /> Mark as Read
                  </>
                }
              </Button>
              <Button 
                variant="error" 
                size="sm"
                onClick={() => {
                  setIsViewModalOpen(false)
                  deleteNotification(currentNotification)
                }}
              >
                <FaTrash className="mr-1" /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteNotification}
        title="Delete Notification"
        message={`Are you sure you want to delete this notification? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="error"
      />
    </div>
  )
}

export default NotificationManagement