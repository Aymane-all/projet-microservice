import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import AppointmentTable from '../common/AppointmentTable';
import { appointments as initialAppointments, getPatientById, getDoctorById } from '../../data/dummyData';

// ✅ Modal d'ajout
const AddAppointmentModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    dateTime: '',
    status: 'scheduled',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      id: Date.now().toString(),
      ...formData,
    };
    onAdd(newAppointment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Ajouter un rendez-vous</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="patientId"
            placeholder="ID du patient"
            value={formData.patientId}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            name="doctorId"
            placeholder="ID du médecin"
            value={formData.doctorId}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No-show</option>
          </select>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ✅ Modal de modification
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
        <h2 className="text-xl mb-4">Modifier le statut</h2>
        <label className="block mb-2 font-semibold">Statut:</label>
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
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Page principale
const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [filterPatient, setFilterPatient] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const patient = getPatientById(appointment.patientId);
      const doctor = getDoctorById(appointment.doctorId);
      const patientName = patient?.name?.toLowerCase() || '';
      const doctorName = doctor?.name?.toLowerCase() || '';

      if (filterPatient && !patientName.includes(filterPatient.toLowerCase())) return false;
      if (filterDoctor && !doctorName.includes(filterDoctor.toLowerCase())) return false;
      if (filterStatus !== 'all' && appointment.status !== filterStatus) return false;

      return true;
    });
  }, [appointments, filterPatient, filterDoctor, filterStatus]);

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleAddSave = (newAppointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
    setIsAdding(false);
  };

  const handleCancel = (id) => {
    if (window.confirm('Confirmer l’annulation ?')) {
      setAppointments(prev =>
        prev.map(appt => appt.id === id ? { ...appt, status: 'cancelled' } : appt)
      );
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
  };

  const handleSaveEdit = (updatedAppointment) => {
    setAppointments(prev =>
      prev.map(appt =>
        appt.id === updatedAppointment.id ? updatedAppointment : appt
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce rendez-vous ?')) {
      setAppointments(prev => prev.filter(appt => appt.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Rendez-vous</h1>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau Rendez-vous
        </button>
      </div>

      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Filtrer par patient"
          value={filterPatient}
          onChange={(e) => setFilterPatient(e.target.value)}
          className="border rounded p-2 flex-grow"
        />
        <input
          type="text"
          placeholder="Filtrer par médecin"
          value={filterDoctor}
          onChange={(e) => setFilterDoctor(e.target.value)}
          className="border rounded p-2 flex-grow"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">Tous les statuts</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-show</option>
        </select>
      </div>

      <AppointmentTable
        appointments={filteredAppointments}
        title="Tous les rendez-vous"
        showDoctor={true}
        showControls={true}
        onAdd={handleAddClick}
        onCancel={handleCancel}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onSave={handleSaveEdit}
        />
      )}

      {isAdding && (
        <AddAppointmentModal
          onClose={() => setIsAdding(false)}
          onAdd={handleAddSave}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
