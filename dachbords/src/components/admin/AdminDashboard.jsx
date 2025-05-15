import React, { useState } from 'react';
import { Users, UserRound, Calendar, AlertTriangle } from 'lucide-react';
import StatsCard from '../common/StatsCard';
import AppointmentTable from '../common/AppointmentTable';
import { NotificationsContainer } from '../common/NotificationCard';
import { getStats, getTodayAppointments, notifications } from '../../data/dummyData';

// Simple modal for editing an appointment
const EditAppointmentModal = ({ appointment, onClose, onSave }) => {
  const [status, setStatus] = useState(appointment.status);

  const handleSave = () => {
    onSave({ ...appointment, status });
    onClose();
  };

  if (!appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-96">
        <h2 className="text-xl mb-4">Edit Appointment Status</h2>
        <label className="block mb-2 font-semibold">Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        >
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-show</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const stats = getStats();
  const initialAppointments = getTodayAppointments();

  const [appointments, setAppointments] = useState(initialAppointments);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
  };

  const handleSaveEdit = (updatedAppointment) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === updatedAppointment.id ? updatedAppointment : appt))
    );
  };

  const handleCancel = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === appointmentId ? { ...appt, status: 'cancelled' } : appt
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to the admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Total Doctors"
          value={stats.totalDoctors}
          icon={UserRound}
          color="green"
        />
        <StatsCard
          title="Appointments Today"
          value={stats.appointmentsToday}
          icon={Calendar}
          color="purple"
        />
        <StatsCard
          title="Cancellations"
          value={stats.cancellations}
          icon={AlertTriangle}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AppointmentTable
            appointments={appointments.slice(0, 10)}
            title="Recent Appointments"
            onEdit={handleEdit}
            onCancel={handleCancel}
          />
        </div>
        <div>
          <NotificationsContainer notifications={notifications.slice(0, 5)} />
        </div>
      </div>

      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
