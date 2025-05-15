import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import WeeklyCalendar from '../common/WeeklyCalendar';
import AvailabilityModal from '../common/AvailabilityModal';
import { availabilities, getAppointmentsByDoctorId } from '../../data/dummyData';
import { useAuth } from '../../context/AuthContext';

const MyAvailabilityPage = () => {
  const { user } = useAuth();
  const doctorId = user?.id || '';
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const appointments = getAppointmentsByDoctorId(doctorId);
  const doctorAvailabilities = availabilities.filter(a => a.doctorId === doctorId);
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Availability</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center hover:bg-indigo-700 transition-colors"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Update Availability
        </button>
      </div>
      
      <WeeklyCalendar 
        appointments={appointments}
        doctorId={doctorId}
      />
      
      <AvailabilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctorId={doctorId}
        availabilities={doctorAvailabilities}
        onSave={() => {
          // Handle save
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default MyAvailabilityPage;
