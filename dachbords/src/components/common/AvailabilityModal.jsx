import React, { useState } from 'react';
import { X } from 'lucide-react';
import { availabilities } from '../../data/dummyData'; // Keep this import if `Availability` is used as a constant or data source

const AvailabilityModal = ({
  isOpen,
  onClose,
  doctorId,
  availabilities,
  onSave
}) => {
  const [editedAvailabilities, setEditedAvailabilities] = useState(availabilities);

  if (!isOpen) return null;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Group availabilities by day
  const availabilitiesByDay = days.map((day, index) => {
    const dayOfWeek = index + 1;
    const dayAvailabilities = editedAvailabilities.filter(a => a.dayOfWeek === dayOfWeek);

    return {
      day,
      dayOfWeek,
      availabilities: dayAvailabilities.length > 0 ? dayAvailabilities : []
    };
  });

  const toggleAvailability = (availabilityId) => {
    setEditedAvailabilities(prev =>
      prev.map(a =>
        a.id === availabilityId
          ? { ...a, isAvailable: !a.isAvailable }
          : a
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedAvailabilities);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Update Availability</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-4">
              Toggle your availability for each day and time slot. Patients will only be able to book appointments during available slots.
            </p>

            <div className="space-y-6">
              {availabilitiesByDay.map(({ day, dayOfWeek, availabilities }) => (
                <div key={dayOfWeek} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <h3 className="font-medium mb-2">{day}</h3>

                  {availabilities.length > 0 ? (
                    <div className="space-y-2">
                      {availabilities.map(availability => (
                        <div key={availability.id} className="flex items-center">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={availability.isAvailable}
                              onChange={() => toggleAvailability(availability.id)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                            />
                            <span className="ml-2 text-sm">
                              {availability.startTime} - {availability.endTime}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No time slots defined</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AvailabilityModal;
