import { useState, useEffect } from 'react'
import { FaPlus, FaSearch, FaEdit, FaTrash, FaSync } from 'react-icons/fa'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import StatusBadge from '../components/ui/StatusBadge'
import Modal, { ConfirmationModal } from '../components/ui/Modal'
import { doctors as mockDoctors, specialties } from '../utils/mockData'

function DoctorManagement() {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentDoctor, setCurrentDoctor] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialty: '',
    phone: '',
    location: '',
    active: true,
    availableDays: []
  })
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setDoctors(mockDoctors)
      setFilteredDoctors(mockDoctors)
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    filterDoctors()
  }, [searchTerm, specialtyFilter, locationFilter, doctors])
  
  const filterDoctors = () => {
    let result = [...doctors]
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(search) || 
        doctor.email.toLowerCase().includes(search)
      )
    }
    
    // Apply specialty filter
    if (specialtyFilter) {
      result = result.filter(doctor => doctor.specialty === specialtyFilter)
    }
    
    // Apply location filter
    if (locationFilter) {
      result = result.filter(doctor => doctor.location === locationFilter)
    }
    
    setFilteredDoctors(result)
  }
  
  const resetFilters = () => {
    setSearchTerm('')
    setSpecialtyFilter('')
    setLocationFilter('')
  }
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'availableDays') {
      const day = value
      let updatedDays = [...formData.availableDays]
      
      if (checked) {
        updatedDays.push(day)
      } else {
        updatedDays = updatedDays.filter(d => d !== day)
      }
      
      setFormData({
        ...formData,
        availableDays: updatedDays
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      })
    }
  }
  
  const handleAddDoctor = () => {
    const newDoctor = {
      id: doctors.length + 1,
      ...formData,
    }
    
    setDoctors([newDoctor, ...doctors])
    setIsAddModalOpen(false)
    resetForm()
  }
  
  const handleEditDoctor = () => {
    const updatedDoctors = doctors.map(doctor => 
      doctor.id === currentDoctor.id ? { ...doctor, ...formData } : doctor
    )
    
    setDoctors(updatedDoctors)
    setIsEditModalOpen(false)
    resetForm()
  }
  
  const handleDeleteDoctor = () => {
    const updatedDoctors = doctors.filter(doctor => doctor.id !== currentDoctor.id)
    setDoctors(updatedDoctors)
    setIsDeleteModalOpen(false)
  }
  
  const handleToggleStatus = (doctorId) => {
    const updatedDoctors = doctors.map(doctor => 
      doctor.id === doctorId ? { ...doctor, active: !doctor.active } : doctor
    )
    
    setDoctors(updatedDoctors)
  }
  
  const viewDoctor = (doctor) => {
    setCurrentDoctor(doctor)
    setIsViewModalOpen(true)
  }
  
  const editDoctor = (doctor) => {
    setCurrentDoctor(doctor)
    setFormData({
      name: doctor.name,
      email: doctor.email,
      specialty: doctor.specialty,
      phone: doctor.phone,
      location: doctor.location,
      active: doctor.active,
      availableDays: doctor.availableDays || []
    })
    setIsEditModalOpen(true)
  }
  
  const deleteDoctor = (doctor) => {
    setCurrentDoctor(doctor)
    setIsDeleteModalOpen(true)
  }
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      specialty: '',
      phone: '',
      location: '',
      active: true,
      availableDays: []
    })
  }
  
  // Get unique locations
  const uniqueLocations = [...new Set(doctors.map(doctor => doctor.location))]
  
  const columns = [
    { field: 'id', title: 'ID' },
    { field: 'name', title: 'Name' },
    { field: 'specialty', title: 'Specialty' },
    { field: 'email', title: 'Email' },
    { field: 'phone', title: 'Phone' },
    { field: 'location', title: 'Location' },
    { 
      field: 'active', 
      title: 'Status',
      render: (value) => (
        <StatusBadge status={value ? 'active' : 'inactive'} />
      )
    },
    { 
      field: 'id', 
      title: 'Actions',
      sortable: false,
      render: (_, doctor) => (
        <div className="flex space-x-2">
          <button 
            className="p-1 text-primary-600 hover:bg-primary-50 rounded"
            onClick={() => viewDoctor(doctor)}
            title="View"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button 
            className="p-1 text-primary-600 hover:bg-primary-50 rounded"
            onClick={() => editDoctor(doctor)}
            title="Edit"
          >
            <FaEdit />
          </button>
          <button 
            className="p-1 text-error-600 hover:bg-error-50 rounded"
            onClick={() => deleteDoctor(doctor)}
            title="Delete"
          >
            <FaTrash />
          </button>
          <button 
            className={`p-1 ${doctor.active ? 'text-error-600 hover:bg-error-50' : 'text-success-600 hover:bg-success-50'} rounded`}
            onClick={() => handleToggleStatus(doctor.id)}
            title={doctor.active ? 'Deactivate' : 'Activate'}
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
          Loading doctors...
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Doctor Management</h1>
        <Button 
          variant="primary" 
          onClick={() => {
            resetForm()
            setIsAddModalOpen(true)
          }}
        >
          <FaPlus className="mr-1" /> Add Doctor
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
            <select 
              className="input"
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select 
              className="input"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Doctors Table */}
      <DataTable 
        columns={columns} 
        data={filteredDoctors}
        defaultSortField="id"
      />
      
      {/* Add Doctor Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Doctor"
        size="lg"
        footer={
          <>
            <Button variant="primary" onClick={handleAddDoctor}>
              Add Doctor
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
              <select
                name="specialty"
                className="input"
                value={formData.specialty}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Specialty</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
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
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              name="location"
              className="input"
              value={formData.location}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Location</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
              <option value="Main Hospital">Main Hospital</option>
              <option value="North Clinic">North Clinic</option>
              <option value="South Clinic">South Clinic</option>
              <option value="East Clinic">East Clinic</option>
              <option value="West Clinic">West Clinic</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                <div key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`day-${day}`}
                    name="availableDays"
                    value={day}
                    checked={formData.availableDays.includes(day)}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor={`day-${day}`} className="ml-2 block text-sm text-gray-700">
                    {day}
                  </label>
                </div>
              ))}
            </div>
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
      
      {/* Edit Doctor Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Doctor"
        size="lg"
        footer={
          <>
            <Button variant="primary" onClick={handleEditDoctor}>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
              <select
                name="specialty"
                className="input"
                value={formData.specialty}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Specialty</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
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
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              name="location"
              className="input"
              value={formData.location}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Location</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                <div key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`edit-day-${day}`}
                    name="availableDays"
                    value={day}
                    checked={formData.availableDays.includes(day)}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor={`edit-day-${day}`} className="ml-2 block text-sm text-gray-700">
                    {day}
                  </label>
                </div>
              ))}
            </div>
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
      
      {/* View Doctor Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Doctor Profile: ${currentDoctor?.name}`}
        footer={
          <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
        }
      >
        {currentDoctor && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold">
                {currentDoctor.name.charAt(0)}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{currentDoctor.name}</h3>
                <p className="text-primary-600 font-medium">{currentDoctor.specialty}</p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Email: {currentDoctor.email}</p>
                  <p>Phone: {currentDoctor.phone}</p>
                  <p>Location: {currentDoctor.location}</p>
                </div>
                
                <div className="mt-3">
                  <StatusBadge 
                    status={currentDoctor.active ? 'active' : 'inactive'} 
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-2">Available Days</h4>
              <div className="flex flex-wrap gap-2">
                {currentDoctor.availableDays && currentDoctor.availableDays.length > 0 ? (
                  currentDoctor.availableDays.map(day => (
                    <span key={day} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                      {day}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No available days set</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteDoctor}
        title="Delete Doctor"
        message={`Are you sure you want to delete Dr. ${currentDoctor?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="error"
      />
    </div>
  )
}

export default DoctorManagement