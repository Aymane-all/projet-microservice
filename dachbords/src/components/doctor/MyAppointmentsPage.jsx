import React from 'react';
import AppointmentTable from '../common/AppointmentTable';
import { getAppointmentsByDoctorId } from '../../data/dummyData';
import { useAuth } from '../../context/AuthContext';

const MyAppointmentsPage = () => {
  const { user } = useAuth();
  const appointments = getAppointmentsByDoctorId(user?.id || '');
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Appointments</h1>
      </div>
      
      <AppointmentTable 
        appointments={appointments}
        showDoctor={false}
        showControls={true}
      />
    </div>
  );
};

export default MyAppointmentsPage;
