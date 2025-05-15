import React, { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import AppointmentTable from '../common/AppointmentTable';
import WeeklyCalendar from '../common/WeeklyCalendar';
import AvailabilityModal from '../common/AvailabilityModal';
import { 
  getTodayAppointmentsByDoctorId, 
  getAppointmentsByDoctorId, 
  availabilities, 
  doctors
} from '../../data/dummyData';
import { useAuth } from '../../context/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const doctorId = user?.id || '';
  
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [localAvailabilities, setLocalAvailabilities] = useState(availabilities);
  
  const todayAppointments = getTodayAppointmentsByDoctorId(doctorId);
  const allAppointments = getAppointmentsByDoctorId(doctorId);
  const doctorAvailabilities = localAvailabilities.filter(a => a.doctorId === doctorId);
  const doctor = doctors.find(d => d.id === doctorId);
  
  const handleSaveAvailability = (updatedAvailabilities) => {
    setLocalAvailabilities(prev => 
      prev.map(a => {
        const updated = updatedAvailabilities.find(ua => ua.id === a.id);
        return updated || a;
      })
    );
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <p className="text-gray-500">Welcome back, {doctor?.name}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="h-16 w-16 rounded-full mr-4">
            <img 
              src={doctor?.avatarUrl} 
              alt={doctor?.name} 
              className="h-16 w-16 rounded-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{doctor?.name}</h2>
            <p className="text-gray-500">{doctor?.specialization}</p>
            <p className="text-sm text-gray-400 mt-1">{doctor?.experience} years experience</p>
          </div>
        </div>
        <div>
          <button 
            onClick={() => setIsAvailabilityModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center transition-colors hover:bg-indigo-700"
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            Update Availability
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentTable 
          appointments={todayAppointments} 
          title="Today's Appointments" 
          showDoctor={false}
        />
        <WeeklyCalendar 
          appointments={allAppointments} 
          doctorId={doctorId}
        />
      </div>
      
      <AvailabilityModal 
        isOpen={isAvailabilityModalOpen}
        onClose={() => setIsAvailabilityModalOpen(false)}
        doctorId={doctorId}
        availabilities={doctorAvailabilities}
        onSave={handleSaveAvailability}
      />
    </div>
  );
};

export default DoctorDashboard;
