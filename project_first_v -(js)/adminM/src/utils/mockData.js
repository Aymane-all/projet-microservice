// Mock data for the dashboard

// Generate a random number between min and max
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

// Generate a random date within the past 60 days
const randomDate = () => {
  const date = new Date()
  date.setDate(date.getDate() - randomNumber(0, 60))
  return date
}

// Generate random future date within next 60 days
const randomFutureDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + randomNumber(1, 60))
  return date
}

// Format date to YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0]
}

// Status options
const appointmentStatus = ['scheduled', 'completed', 'cancelled', 'no-show']
const specialties = ['Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Ophthalmology', 'Gynecology']
const userRoles = ['patient', 'doctor', 'admin', 'receptionist']
const notificationTypes = ['appointment_reminder', 'appointment_confirmation', 'appointment_cancellation', 'doctor_available', 'test_results']

// Generate mock users
export const users = Array(50).fill().map((_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  role: userRoles[randomNumber(0, userRoles.length - 1)],
  phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
  active: Math.random() > 0.2,  // 80% active
  createdAt: formatDate(randomDate())
}))

// Generate mock doctors
export const doctors = Array(20).fill().map((_, index) => ({
  id: index + 1,
  name: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][randomNumber(0, 7)]} ${index + 1}`,
  email: `doctor${index + 1}@example.com`,
  specialty: specialties[randomNumber(0, specialties.length - 1)],
  phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
  location: ['Main Hospital', 'North Clinic', 'South Clinic', 'East Clinic', 'West Clinic'][randomNumber(0, 4)],
  active: Math.random() > 0.1,  // 90% active
  availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    .filter(() => Math.random() > 0.3)  // Random available days
}))

// Generate mock time slots
export const timeSlots = doctors.flatMap(doctor => {
  return Array(randomNumber(5, 15)).fill().map((_, index) => ({
    id: `${doctor.id}-${index}`,
    doctorId: doctor.id,
    doctorName: doctor.name,
    day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][randomNumber(0, 4)],
    startTime: `${randomNumber(8, 16)}:${['00', '30'][randomNumber(0, 1)]}`,
    endTime: `${randomNumber(9, 17)}:${['00', '30'][randomNumber(0, 1)]}`,
    available: Math.random() > 0.3  // 70% available
  }))
})

// Generate mock appointments
export const appointments = Array(100).fill().map((_, index) => {
  const date = randomFutureDate()
  const doctor = doctors[randomNumber(0, doctors.length - 1)]
  const status = appointmentStatus[randomNumber(0, appointmentStatus.length - 1)]
  
  return {
    id: index + 1,
    patientId: randomNumber(1, users.length),
    patientName: `Patient ${randomNumber(1, users.length)}`,
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    date: formatDate(date),
    time: `${randomNumber(8, 16)}:${['00', '30'][randomNumber(0, 1)]}`,
    status,
    notes: status === 'cancelled' ? 'Patient requested cancellation' : '',
    createdAt: formatDate(randomDate())
  }
})

// Generate appointment history (past appointments)
export const appointmentHistory = Array(200).fill().map((_, index) => {
  const date = randomDate()
  const doctor = doctors[randomNumber(0, doctors.length - 1)]
  
  return {
    id: index + 1,
    patientId: randomNumber(1, users.length),
    patientName: `Patient ${randomNumber(1, users.length)}`,
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    date: formatDate(date),
    time: `${randomNumber(8, 16)}:${['00', '30'][randomNumber(0, 1)]}`,
    status: appointmentStatus[randomNumber(0, appointmentStatus.length - 1)],
    notes: Math.random() > 0.7 ? 'Follow-up required in 2 weeks' : '',
    createdAt: formatDate(new Date(date.getTime() - randomNumber(1, 14) * 24 * 60 * 60 * 1000))
  }
})

// Generate notifications
export const notifications = Array(80).fill().map((_, index) => {
  const date = randomDate()
  const type = notificationTypes[randomNumber(0, notificationTypes.length - 1)]
  
  return {
    id: index + 1,
    type,
    userId: randomNumber(1, users.length),
    userName: `User ${randomNumber(1, users.length)}`,
    message: `Notification message for ${type}`,
    read: Math.random() > 0.5,  // 50% read
    sentAt: formatDate(date)
  }
})

// Dashboard statistics
export const dashboardStats = {
  totalPatients: users.filter(user => user.role === 'patient').length,
  totalDoctors: doctors.length,
  totalAppointments: appointments.length + appointmentHistory.length,
  upcomingAppointments: appointments.filter(apt => apt.status === 'scheduled').length,
  cancelledAppointments: appointments.filter(apt => apt.status === 'cancelled').length + 
                         appointmentHistory.filter(apt => apt.status === 'cancelled').length,
  completedAppointments: appointmentHistory.filter(apt => apt.status === 'completed').length,
  specialtiesDistribution: specialties.map(specialty => ({
    name: specialty,
    count: doctors.filter(doc => doc.specialty === specialty).length
  })),
  appointmentsPerDay: (() => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return days.map(day => ({
      name: day,
      count: randomNumber(5, 30)
    }))
  })()
}

// Recent activities for dashboard
export const recentActivities = [
  { id: 1, type: 'appointment_created', user: 'Dr. Smith', time: '2 hours ago', message: 'created a new appointment with Patient 34' },
  { id: 2, type: 'appointment_cancelled', user: 'Patient 12', time: '3 hours ago', message: 'cancelled their appointment with Dr. Johnson' },
  { id: 3, type: 'doctor_added', user: 'Admin', time: '5 hours ago', message: 'added Dr. Williams to the system' },
  { id: 4, type: 'timeslot_modified', user: 'Dr. Davis', time: '1 day ago', message: 'modified their available time slots' },
  { id: 5, type: 'appointment_completed', user: 'Dr. Brown', time: '1 day ago', message: 'completed an appointment with Patient 23' },
  { id: 6, type: 'notification_sent', user: 'System', time: '2 days ago', message: 'sent appointment reminders to 15 patients' }
]

export { specialties }