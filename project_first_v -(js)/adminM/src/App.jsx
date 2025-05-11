import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import UserManagement from './pages/UserManagement'
import DoctorManagement from './pages/DoctorManagement'
import TimeSlotManagement from './pages/TimeSlotManagement'
import AppointmentManagement from './pages/AppointmentManagement'
import AppointmentHistory from './pages/AppointmentHistory'
import NotificationManagement from './pages/NotificationManagement'

function App() {
  const [user] = useState({
    name: 'Dr. Sarah Johnson',
    role: 'Admin',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  })

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout user={user} />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="doctors" element={<DoctorManagement />} />
        <Route path="timeslots" element={<TimeSlotManagement />} />
        <Route path="appointments" element={<AppointmentManagement />} />
        <Route path="history" element={<AppointmentHistory />} />
        <Route path="notifications" element={<NotificationManagement />} />
      </Route>
    </Routes>
  )
}

export default App