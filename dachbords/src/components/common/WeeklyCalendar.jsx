import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { availabilities, getPatientById } from '../../data/dummyData';

const WeeklyCalendar = ({ appointments, doctorId, onSlotClick }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const formatDayAndDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return {
      day: days[date.getDay()],
      date: date.getDate()
    };
  };

  const previousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  const nextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  const weekAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.dateTime);
    const weekStartTime = currentWeekStart.getTime();
    const weekEndTime = new Date(currentWeekStart).setDate(currentWeekStart.getDate() + 6);

    return appointment.doctorId === doctorId && 
           appointmentDate.getTime() >= weekStartTime && 
           appointmentDate.getTime() <= weekEndTime;
  });

  const appointmentsByDay = weekDates.map(date => {
    const dayAppointments = weekAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.dateTime);
      return appointmentDate.getDate() === date.getDate() &&
             appointmentDate.getMonth() === date.getMonth() &&
             appointmentDate.getFullYear() === date.getFullYear();
    });

    return { date, appointments: dayAppointments };
  });

  const isDayAvailable = (date) => {
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
    return availabilities.some(a => 
      a.doctorId === doctorId && 
      a.dayOfWeek === dayOfWeek && 
      a.isAvailable
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Weekly Schedule</h2>
        <div className="flex space-x-2">
          <button 
            onClick={previousWeek}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={nextWeek}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 p-4">
        {weekDates.map((date, index) => {
          const { day, date: dateNum } = formatDayAndDate(date);
          const isCurrentDay = isToday(date);

          return (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 uppercase mb-1">{day}</div>
              <div 
                className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-sm
                  ${isCurrentDay ? 'bg-indigo-500 text-white' : 'text-gray-700'}`}
              >
                {dateNum}
              </div>
            </div>
          );
        })}

        {appointmentsByDay.map((day, dayIndex) => {
          const isAvailable = isDayAvailable(day.date);

          return (
            <div key={dayIndex} className={`pt-2 min-h-36 ${!isAvailable ? 'bg-gray-50' : ''}`}>
              {!isAvailable ? (
                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                  Not Available
                </div>
              ) : day.appointments.length === 0 ? (
                <div 
                  className="h-full flex items-center justify-center text-sm text-indigo-500 hover:bg-indigo-50 cursor-pointer transition-colors rounded"
                  onClick={() => onSlotClick && onSlotClick(day.date)}
                >
                  Available
                </div>
              ) : (
                <div className="space-y-2 px-1">
                  {day.appointments.map(appointment => {
                    const patient = getPatientById(appointment.patientId);
                    const appointmentTime = new Date(appointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div 
                        key={appointment.id} 
                        className={`p-2 rounded text-xs ${
                          appointment.status === 'cancelled' 
                            ? 'bg-red-50 border border-red-100' 
                            : 'bg-blue-50 border border-blue-100'
                        }`}
                      >
                        <div className="font-semibold truncate">{appointmentTime}</div>
                        <div className="truncate">{patient?.name}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
