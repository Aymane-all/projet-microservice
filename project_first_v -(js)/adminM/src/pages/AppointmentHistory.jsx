import { useState, useEffect } from 'react'
import { FaSearch, FaFileDownload, FaEye } from 'react-icons/fa'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import StatusBadge from '../components/ui/StatusBadge'
import Modal from '../components/ui/Modal'
import { appointmentHistory as mockHistory } from '../utils/mockData'

function AppointmentHistory() {
  const [history, setHistory] = useState([])
  const [filteredHistory, setFilteredHistory] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [doctorFilter, setDoctorFilter] = useState('')
  const [patientFilter, setPatientFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: '',
    endDate: ''
  })
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentAppointment, setCurrentAppointment] = useState(null)
  
  // Get unique doctors and patients
  const [uniqueDoctors, setUniqueDoctors] = useState([])
  const [uniquePatients, setUniquePatients] = useState([])
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setHistory(mockHistory)
      setFilteredHistory(mockHistory)
      
      // Extract unique doctors and patients
      const doctors = [...new Set(mockHistory.map(item => item.doctorName))]
        .map(name => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name
        }))
      
      const patients = [...new Set(mockHistory.map(item => item.patientName))]
        .map(name => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name
        }))
      
      setUniqueDoctors(doctors)
      setUniquePatients(patients)
      
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    filterHistory()
  }, [doctorFilter, patientFilter, statusFilter, dateRangeFilter, history])
  
  const filterHistory = () => {
    let result = [...history]
    
    // Apply doctor filter
    if (doctorFilter) {
      result = result.filter(item => item.doctorName === doctorFilter)
    }
    
    // Apply patient filter
    if (patientFilter) {
      result = result.filter(item => item.patientName === patientFilter)
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(item => item.status === statusFilter)
    }
    
    // Apply date range filter
    if (dateRangeFilter.startDate) {
      result = result.filter(item => item.date >= dateRangeFilter.startDate)
    }
    
    if (dateRangeFilter.endDate) {
      result = result.filter(item => item.date <= dateRangeFilter.endDate)
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })
    
    setFilteredHistory(result)
  }
  
  const resetFilters = () => {
    setDoctorFilter('')
    setPatientFilter('')
    setStatusFilter('')
    setDateRangeFilter({
      startDate: '',
      endDate: ''
    })
  }
  
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target
    setDateRangeFilter({
      ...dateRangeFilter,
      [name]: value
    })
  }
  
  const viewAppointment = (appointment) => {
    setCurrentAppointment(appointment)
    setIsViewModalOpen(true)
  }
  
  const exportToCSV = () => {
    const headers = [
      'ID', 'Patient', 'Doctor', 'Specialty', 
      'Date', 'Time', 'Status', 'Notes', 'Created At'
    ]
    
    const csvRows = [
      headers.join(','),
      ...filteredHistory.map(item => {
        return [
          item.id,
          `"${item.patientName}"`,
          `"${item.doctorName}"`,
          `"${item.specialty}"`,
          item.date,
          item.time,
          item.status,
          `"${item.notes.replace(/"/g, '""')}"`,
          item.createdAt
        ].join(',')
      })
    ]
    
    const csvContent = csvRows.join('\n')
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.setAttribute('href', url)
    link.setAttribute('download', `appointment_history_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
            <FaEye />
          </button>
        </div>
      )
    }
  ]
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse-slow text-primary-500 text-lg">
          Loading appointment history...
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Appointment History</h1>
        <Button 
          variant="outline" 
          onClick={exportToCSV}
        >
          <FaFileDownload className="mr-1" /> Export to CSV
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by patient name"
                  className="input pl-10"
                  value={patientFilter}
                  onChange={(e) => setPatientFilter(e.target.value)}
                  list="patients-list"
                />
                <datalist id="patients-list">
                  {uniquePatients.map(patient => (
                    <option key={patient.id} value={patient.name} />
                  ))}
                </datalist>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by doctor name"
                  className="input pl-10"
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                  list="doctors-list"
                />
                <datalist id="doctors-list">
                  {uniqueDoctors.map(doctor => (
                    <option key={doctor.id} value={doctor.name} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                className="input"
                name="startDate"
                value={dateRangeFilter.startDate}
                onChange={handleDateRangeChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                className="input"
                name="endDate"
                value={dateRangeFilter.endDate}
                onChange={handleDateRangeChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>
      
      {/* History Table */}
      <DataTable 
        columns={columns} 
        data={filteredHistory}
        defaultSortField="date"
        defaultSortDirection="desc"
      />
      
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
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AppointmentHistory