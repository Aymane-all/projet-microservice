import { useState, useEffect } from 'react'
import { FaPlus, FaFilter, FaEdit, FaTrash, FaBan, FaCheck } from 'react-icons/fa'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import StatusBadge from '../components/ui/StatusBadge'
import Modal, { ConfirmationModal } from '../components/ui/Modal'
import { 
  appointments as mockAppointments, 
  doctors as mockDoctors,
  users as mockUsers,
  timeSlots as mockTimeSlots 
} from '../utils/mockData'

function AppointmentManagement() {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [doctorFilter, setDoctorFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)
  const [currentAppointment, setCurrentAppointment] = useState(null)
  
  // Form state for add/edit
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    notes: ''
  })
  
  const [cancellationReason, setCancellationReason] = useState('')
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setAppointments(mockAppointments)
      setFilteredAppointments(mockAppointments)
      setDoctors(mockDoctors.filter(doc => doc.active))
      setPatients(mockUsers.filter(user => user.role === 'patient' && user.active))
      setTimeSlots(mockTimeSlots.filter(slot => slot.available))
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    filterAppointments()
  }, [doctorFilter, statusFilter, dateFilter, appointments])
  
  const filterAppointments = () => {
    let result = [...appointments]
    
    // Apply doctor filter
    if (doctorFilter) {
      result = result.filter(appointment => appointment.doctorId === parseInt(doctorFilter))
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(appointment => appointment.status === statusFilter)
    }
    
    // Apply date filter
    if (dateFilter) {
      result = result.filter(appointment => appointment.date === dateFilter)
    }
    
    // Always sort by date (newest first)
    result.sort((a, b) => {
      // First compare dates
      const dateComparison = new Date(b.date) - new Date(a.date)
      if (dateComparison !== 0) return dateComparison
      
      // If dates are equal, compare times
      return a.time.localeCompare(b.time)
    })
    
    setFilteredAppointments(result)
  }
  
  const resetFilters = () => {
    setDoctorFilter('')
    setStatusFilter('')
    setDateFilter('')
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleAddAppointment = () => {
    const doctor = doctors.find(doc => doc.id === parseInt(formData.doctorId))
    const patient = patients.find(pat => pat.id === parseInt(formData.patientId))
    
    const newAppointment = {
      id: appointments.length + 1,
      patientId: parseInt(formData.patientId),
      patientName: patient?.name || '',
      doctorId: parseInt(formData.doctorId),
      doctorName: doctor?.name || '',
      specialty: doctor?.specialty || '',
      date: formData.date,
      time: formData.time,
      status: 'scheduled',
      notes: formData.notes,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setAppointments([newAppointment, ...appointments])
    setIsAddModalOpen(false)
    resetForm()
  }
  
  const handleEditAppointment = () => {
    const doctor = doctors.find(doc => doc.id === parseInt(formData.doctorId))
    const patient = patients.find(pat => pat.id === parseInt(formData.patientId))
    
    const updatedAppointments = appointments.map(appointment => 
      appointment.id === currentAppointment.id ? { 
        ...appointment, 
        patientId: parseInt(formData.patientId),
        patientName: patient?.name || '',
        doctorId: parseInt(formData.doctorId),
        doctorName: doctor?.name || '',
        specialty: doctor?.specialty || '',
        date: formData.date,
        time: formData.time,
        notes: formData.notes
      } : appointment
    )
    
    setAppointments(updatedAppointments)
    setIsEditModalOpen(false)
    resetForm()
  }
  
  const handleCancelAppointment = () => {
    const updatedAppointments = appointments.map(appointment => 
      appointment.id === currentAppointment.id ? { 
        ...appointment, 
        status: 'cancelled',
        notes: cancellationReason || appointment.notes
      } : appointment
    )
    
    setAppointments(updatedAppointments)
    setIsCancelModalOpen(false)
    setCancellationReason('')
  }
  
  const handleCompleteAppointment = () => {
    const updatedAppointments = appointments.map(appointment => 
      appointment.id === currentAppointment.id ? { 
        ...appointment, 
        status: 'completed'
      } : appointment
    )
    
    setAppointments(updatedAppointments)
    setIsCompleteModalOpen(false)
  }
  
  const viewAppointment = (appointment) => {
    setCurrentAppointment(appointment)
    setIsViewModalOpen(true)
  }
  
  const editAppointment = (appointment) => {
    setCurrentAppointment(appointment)
    setFormData({
      patientId: appointment.patientId.toString(),
      doctorId: appointment.doctorId.toString(),
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes
    })
    setIsEditModalOpen(true)
  }
  
  const cancelAppointment = (appointment) => {
    setCurrentAppointment(appointment)
    setCancellationReason('')
    setIsCancelModalOpen(true)
  }
  
  const completeAppointment = (appointment) => {
    setCurrentAppointment(appointment)
    setIsCompleteModalOpen(true)
  }
  
  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      date: '',
      time: '',
      notes: ''
    })
  }
  
  // Generate dates for the next 60 days
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 60; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Format as YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0]
      dates.push(formattedDate)
    }
    
    return dates
  }
  
  // Get available time slots for the selected doctor and date
  const getAvailableTimeSlots = () => {
    if (!formData.doctorId || !formData.date) return []
    
    // Get the day of the week for the selected date
    const date = new Date(formData.date)
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
    
    // Filter time slots for the selected doctor and day
    return timeSlots.filter(slot => 
      slot.doctorId === parseInt(formData.doctorId) && 
      slot.day === dayOfWeek &&
      slot.available
    )
  }
  
  const columns = [
    { field: 'id', title: 'ID' },
    { field: 'patientName', title: 'Patient' },
    { field: 'doctorName', title: 'Doctor' },
    { field: 'specialty', title: 'Specialty' },
    { field: 'date', title: 'Date' },
    { field: 'time', title: 'Time' },
    { 
      field: 'status', 
      title: 'Status',
      render: (value) => (
        <StatusBadge status={value} />
      )
    },
    { 
      field: 'id', 
      title: 'Actions',
      sortable: false,
      render: (_, appointment) => (
        <div className="flex space-x-2">
          <button 
            className="p-1 text-primary-600 hover:bg-primary-50 rounded"
            onClick={() => viewAppointment(appointment)}
            title="View Details"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          
          {appointment.status === 'scheduled' && (
            <>
              <button 
                className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                onClick={() => editAppointment(appointment)}
                title="Edit"
              >
                <FaEdit />
              </button>
              <button 
                className="p-1 text-success-600 hover:bg-success-50 rounded"
                onClick={() => completeAppointment(appointment)}
                title="Mark as Completed"
              >
                <FaCheck />
              </button>
              <button 
                className="p-1 text-error-600 hover:bg-error-50 rounded"
                onClick={() => cancelAppointment(appointment)}
                title="Cancel"
              >
                <FaBan />
              </button>
            </>
          )}
        </div>
      )
    }
  ]
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse-slow text-primary-500 text-lg">
          Loading appointments...
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Appointment Management</h1>
        <Button 
          variant="primary" 
          onClick={() => {
            resetForm()
            setIsAddModalOpen(true)
          }}
        >
          <FaPlus className="mr-1" /> Schedule Appointment
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
          
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          
          <div className="flex-shrink-0">
            <Button variant="outline" onClick={resetFilters}>
              <FaFilter className="mr-1" /> Reset Filters
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Appointments Table */}
      <DataTable 
        columns={columns} 
        data={filteredAppointments}
        defaultSortField="date"
        defaultSortDirection="desc"
      />
      
      {/* Add Appointment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule New Appointment"
        size="lg"
        footer={
          <>
            <Button 
              variant="primary" 
              onClick={handleAddAppointment}
              disabled={!formData.patientId || !formData.doctorId || !formData.date || !formData.time}
            >
              Schedule Appointment
            </Button>
            <Button variant="outline" className="ml-2" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select
                name="patientId"
                className="input"
                value={formData.patientId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <select
                name="date"
                className="input"
                value={formData.date}
                onChange={handleInputChange}
                required
                disabled={!formData.doctorId}
              >
                <option value="">Select Date</option>
                {getAvailableDates().map(date => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
              {!formData.doctorId && (
                <p className="mt-1 text-xs text-gray-500">Please select a doctor first</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <select
                name="time"
                className="input"
                value={formData.time}
                onChange={handleInputChange}
                required
                disabled={!formData.doctorId || !formData.date}
              >
                <option value="">Select Time</option>
                {getAvailableTimeSlots().map(slot => (
                  <option key={slot.id} value={slot.startTime}>
                    {slot.startTime} - {slot.endTime}
                  </option>
                ))}
              </select>
              {(!formData.doctorId || !formData.date) && (
                <p className="mt-1 text-xs text-gray-500">Please select a doctor and date first</p>
              )}
              {formData.doctorId && formData.date && getAvailableTimeSlots().length === 0 && (
                <p className="mt-1 text-xs text-error-500">No available time slots for this doctor on selected date</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              rows="3"
              className="input"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any additional information or special instructions"
            />
          </div>
        </div>
      </Modal>
      
      {/* Edit Appointment Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Appointment"
        size="lg"
        footer={
          <>
            <Button 
              variant="primary" 
              onClick={handleEditAppointment}
              disabled={!formData.patientId || !formData.doctorId || !formData.date || !formData.time}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select
                name="patientId"
                className="input"
                value={formData.patientId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <select
                name="date"
                className="input"
                value={formData.date}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Date</option>
                {getAvailableDates().map(date => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <select
                name="time"
                className="input"
                value={formData.time}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Time</option>
                {getAvailableTimeSlots().length > 0 ? (
                  getAvailableTimeSlots().map(slot => (
                    <option key={slot.id} value={slot.startTime}>
                      {slot.startTime} - {slot.endTime}
                    </option>
                  ))
                ) : (
                  // Include the current time as an option when editing
                  <option value={currentAppointment?.time}>
                    {currentAppointment?.time}
                  </option>
                )}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              rows="3"
              className="input"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any additional information or special instructions"
            />
          </div>
        </div>
      </Modal>
      
      {/* View Appointment Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Appointment Details"
        footer={
          <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
        }
      >
        {currentAppointment && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Appointment #{currentAppointment.id}</h3>
              <StatusBadge status={currentAppointment.status} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Patient</div>
                <div className="font-medium">{currentAppointment.patientName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Date & Time</div>
                <div className="font-medium">{currentAppointment.date} at {currentAppointment.time}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Doctor</div>
                <div className="font-medium">{currentAppointment.doctorName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Specialty</div>
                <div className="font-medium">{currentAppointment.specialty}</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500">Notes</div>
              <div className="bg-gray-50 p-3 rounded mt-1">
                {currentAppointment.notes ? (
                  <p>{currentAppointment.notes}</p>
                ) : (
                  <p className="text-gray-400 italic">No notes provided</p>
                )}
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="text-sm text-gray-500">Created on</div>
              <div className="font-medium">{currentAppointment.createdAt}</div>
            </div>
            
            {currentAppointment.status === 'scheduled' && (
              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => {
                    setIsViewModalOpen(false)
                    editAppointment(currentAppointment)
                  }}
                >
                  <FaEdit className="mr-1" /> Edit
                </Button>
                <Button 
                  variant="success" 
                  size="sm"
                  onClick={() => {
                    setIsViewModalOpen(false)
                    completeAppointment(currentAppointment)
                  }}
                >
                  <FaCheck className="mr-1" /> Complete
                </Button>
                <Button 
                  variant="error" 
                  size="sm"
                  onClick={() => {
                    setIsViewModalOpen(false)
                    cancelAppointment(currentAppointment)
                  }}
                >
                  <FaBan className="mr-1" /> Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
      
      {/* Cancel Appointment Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Appointment"
        footer={
          <>
            <Button 
              variant="error" 
              onClick={handleCancelAppointment}
            >
              Cancel Appointment
            </Button>
            <Button variant="outline" className="ml-2" onClick={() => setIsCancelModalOpen(false)}>
              Go Back
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            You are about to cancel the appointment for {currentAppointment?.patientName} with {currentAppointment?.doctorName} on {currentAppointment?.date} at {currentAppointment?.time}.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Reason</label>
            <textarea
              rows="3"
              className="input"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Provide a reason for cancellation"
            />
          </div>
        </div>
      </Modal>
      
      {/* Complete Appointment Modal */}
      <ConfirmationModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirm={handleCompleteAppointment}
        title="Complete Appointment"
        message={`Are you sure you want to mark this appointment as completed? This will update the appointment status for ${currentAppointment?.patientName} with ${currentAppointment?.doctorName} on ${currentAppointment?.date}.`}
        confirmLabel="Complete"
        confirmVariant="success"
      />
    </div>
  )
}

export default AppointmentManagement