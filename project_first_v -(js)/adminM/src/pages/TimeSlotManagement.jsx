import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaFilter } from 'react-icons/fa'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import StatusBadge from '../components/ui/StatusBadge'
import Modal, { ConfirmationModal } from '../components/ui/Modal'
import { timeSlots as mockTimeSlots, doctors as mockDoctors } from '../utils/mockData'

function TimeSlotManagement() {
  const [timeSlots, setTimeSlots] = useState([])
  const [filteredTimeSlots, setFilteredTimeSlots] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [doctorFilter, setDoctorFilter] = useState('')
  const [dayFilter, setDayFilter] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('')
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentTimeSlot, setCurrentTimeSlot] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    doctorId: '',
    day: '',
    startTime: '',
    endTime: '',
    available: true
  })
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const timeOptions = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ]
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setTimeSlots(mockTimeSlots)
      setFilteredTimeSlots(mockTimeSlots)
      setDoctors(mockDoctors.filter(doc => doc.active))
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    filterTimeSlots()
  }, [doctorFilter, dayFilter, availabilityFilter, timeSlots])
  
  const filterTimeSlots = () => {
    let result = [...timeSlots]
    
    // Apply doctor filter
    if (doctorFilter) {
      result = result.filter(slot => slot.doctorId === parseInt(doctorFilter))
    }
    
    // Apply day filter
    if (dayFilter) {
      result = result.filter(slot => slot.day === dayFilter)
    }
    
    // Apply availability filter
    if (availabilityFilter !== '') {
      const isAvailable = availabilityFilter === 'available'
      result = result.filter(slot => slot.available === isAvailable)
    }
    
    setFilteredTimeSlots(result)
  }
  
  const resetFilters = () => {
    setDoctorFilter('')
    setDayFilter('')
    setAvailabilityFilter('')
  }
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }
  
  const handleAddTimeSlot = () => {
    const doctor = doctors.find(doc => doc.id === parseInt(formData.doctorId))
    
    const newTimeSlot = {
      id: `${formData.doctorId}-${timeSlots.length + 1}`,
      doctorId: parseInt(formData.doctorId),
      doctorName: doctor?.name || '',
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
      available: formData.available
    }
    
    setTimeSlots([newTimeSlot, ...timeSlots])
    setIsAddModalOpen(false)
    resetForm()
  }
  
  const handleEditTimeSlot = () => {
    const doctor = doctors.find(doc => doc.id === parseInt(formData.doctorId))
    
    const updatedTimeSlots = timeSlots.map(slot => 
      slot.id === currentTimeSlot.id ? { 
        ...slot, 
        doctorId: parseInt(formData.doctorId),
        doctorName: doctor?.name || '',
        day: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime,
        available: formData.available
      } : slot
    )
    
    setTimeSlots(updatedTimeSlots)
    setIsEditModalOpen(false)
    resetForm()
  }
  
  const handleDeleteTimeSlot = () => {
    const updatedTimeSlots = timeSlots.filter(slot => slot.id !== currentTimeSlot.id)
    setTimeSlots(updatedTimeSlots)
    setIsDeleteModalOpen(false)
  }
  
  const handleToggleAvailability = (slotId) => {
    const updatedTimeSlots = timeSlots.map(slot => 
      slot.id === slotId ? { ...slot, available: !slot.available } : slot
    )
    
    setTimeSlots(updatedTimeSlots)
  }
  
  const editTimeSlot = (timeSlot) => {
    setCurrentTimeSlot(timeSlot)
    setFormData({
      doctorId: timeSlot.doctorId.toString(),
      day: timeSlot.day,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
      available: timeSlot.available
    })
    setIsEditModalOpen(true)
  }
  
  const deleteTimeSlot = (timeSlot) => {
    setCurrentTimeSlot(timeSlot)
    setIsDeleteModalOpen(true)
  }
  
  const resetForm = () => {
    setFormData({
      doctorId: '',
      day: '',
      startTime: '',
      endTime: '',
      available: true
    })
  }
  
  const columns = [
    { field: 'doctorName', title: 'Doctor' },
    { field: 'day', title: 'Day' },
    { field: 'startTime', title: 'Start Time' },
    { field: 'endTime', title: 'End Time' },
    { 
      field: 'available', 
      title: 'Availability',
      render: (value) => (
        <StatusBadge status={value ? 'available' : 'unavailable'} />
      )
    },
    { 
      field: 'id', 
      title: 'Actions',
      sortable: false,
      render: (_, slot) => (
        <div className="flex space-x-2">
          <button 
            className="p-1 text-primary-600 hover:bg-primary-50 rounded"
            onClick={() => editTimeSlot(slot)}
            title="Edit"
          >
            <FaEdit />
          </button>
          <button 
            className="p-1 text-error-600 hover:bg-error-50 rounded"
            onClick={() => deleteTimeSlot(slot)}
            title="Delete"
          >
            <FaTrash />
          </button>
          <button 
            className={`p-1 ${slot.available ? 'text-error-600 hover:bg-error-50' : 'text-success-600 hover:bg-success-50'} rounded`}
            onClick={() => handleToggleAvailability(slot.id)}
            title={slot.available ? 'Set as Unavailable' : 'Set as Available'}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {slot.available ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
          </button>
        </div>
      )
    }
  ]
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse-slow text-primary-500 text-lg">
          Loading time slots...
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Time Slot Management</h1>
        <Button 
          variant="primary" 
          onClick={() => {
            resetForm()
            setIsAddModalOpen(true)
          }}
        >
          <FaPlus className="mr-1" /> Add Time Slot
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
            <select 
              className="input"
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
            >
              <option value="">All Doctors</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <select 
              className="input"
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value)}
            >
              <option value="">All Days</option>
              {days.map(day => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <select 
              className="input"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          
          <div className="flex-shrink-0">
            <Button variant="outline" onClick={resetFilters}>
              <FaFilter className="mr-1" /> Reset Filters
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Time Slots Table */}
      <DataTable 
        columns={columns} 
        data={filteredTimeSlots}
        defaultSortField="doctorName"
      />
      
      {/* Add Time Slot Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Time Slot"
        footer={
          <>
            <Button 
              variant="primary" 
              onClick={handleAddTimeSlot}
              disabled={!formData.doctorId || !formData.day || !formData.startTime || !formData.endTime}
            >
              Add Time Slot
            </Button>
            <Button variant="outline" className="ml-2" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
            <select
              name="doctorId"
              className="input"
              value={formData.doctorId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <select
              name="day"
              className="input"
              value={formData.day}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Day</option>
              {days.map(day => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <select
                name="startTime"
                className="input"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Time</option>
                {timeOptions.slice(0, -1).map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <select
                name="endTime"
                className="input"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Time</option>
                {timeOptions.slice(1).map(time => (
                  <option 
                    key={time} 
                    value={time}
                    disabled={formData.startTime && time <= formData.startTime}
                  >
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
              Available for booking
            </label>
          </div>
        </div>
      </Modal>
      
      {/* Edit Time Slot Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Time Slot"
        footer={
          <>
            <Button 
              variant="primary" 
              onClick={handleEditTimeSlot}
              disabled={!formData.doctorId || !formData.day || !formData.startTime || !formData.endTime}
            >
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
            <select
              name="doctorId"
              className="input"
              value={formData.doctorId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <select
              name="day"
              className="input"
              value={formData.day}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Day</option>
              {days.map(day => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <select
                name="startTime"
                className="input"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Time</option>
                {timeOptions.slice(0, -1).map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <select
                name="endTime"
                className="input"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Time</option>
                {timeOptions.slice(1).map(time => (
                  <option 
                    key={time} 
                    value={time}
                    disabled={formData.startTime && time <= formData.startTime}
                  >
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="edit-available"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="edit-available" className="ml-2 block text-sm text-gray-700">
              Available for booking
            </label>
          </div>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTimeSlot}
        title="Delete Time Slot"
        message={`Are you sure you want to delete this time slot (${currentTimeSlot?.day} ${currentTimeSlot?.startTime}-${currentTimeSlot?.endTime})? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="error"
      />
    </div>
  )
}

export default TimeSlotManagement