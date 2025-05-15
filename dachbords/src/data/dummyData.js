// Dummy data to simulate backend responses

// Removed TypeScript interfaces

export const doctors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    avatarUrl: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150',
    email: 'sarah.johnson@example.com',
    phone: '(555) 123-4567',
    experience: 12
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Neurologist',
    avatarUrl: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150',
    email: 'michael.chen@example.com',
    phone: '(555) 234-5678',
    experience: 8
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrician',
    avatarUrl: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=150',
    email: 'emily.rodriguez@example.com',
    phone: '(555) 345-6789',
    experience: 10
  },
  {
    id: '4',
    name: 'Dr. James Williams',
    specialization: 'Orthopedic Surgeon',
    avatarUrl: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=150',
    email: 'james.williams@example.com',
    phone: '(555) 456-7890',
    experience: 15
  },
];

export const patients = [
  {
    id: '1',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    phone: '(555) 567-8901',
    avatarUrl: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=150',
    birthDate: '1985-06-15'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    phone: '(555) 678-9012',
    avatarUrl: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
    birthDate: '1990-02-28'
  },
  {
    id: '3',
    name: 'Carol Johnson',
    email: 'carol.johnson@example.com',
    phone: '(555) 789-0123',
    avatarUrl: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150',
    birthDate: '1978-11-20'
  },
  {
    id: '4',
    name: 'David Lee',
    email: 'david.lee@example.com',
    phone: '(555) 890-1234',
    avatarUrl: 'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=150',
    birthDate: '1995-04-10'
  },
  {
    id: '5',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    phone: '(555) 901-2345',
    avatarUrl: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=150',
    birthDate: '1982-09-05'
  },
];

const today = new Date();

const generateAppointments = () => {
  const appointments = [];
  const statuses = ['scheduled', 'completed', 'cancelled', 'no-show'];

  for (let i = 0; i < 10; i++) {
    const hours = 9 + Math.floor(i / 2);
    const minutes = (i % 2) * 30;
    const appointmentDate = new Date(today);
    appointmentDate.setHours(hours, minutes, 0, 0);

    appointments.push({
      id: `today-${i + 1}`,
      patientId: patients[i % patients.length].id,
      doctorId: doctors[Math.floor(i / 3) % doctors.length].id,
      dateTime: appointmentDate.toISOString(),
      status: i < 6 ? 'scheduled' : statuses[Math.floor(Math.random() * statuses.length)],
      notes: i % 3 === 0 ? 'Follow-up appointment' : undefined,
      createdAt: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString()
    });
  }

  for (let day = 1; day <= 7; day++) {
    for (let i = 0; i < 8; i++) {
      const hours = 9 + Math.floor(i / 2);
      const minutes = (i % 2) * 30;
      const appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() + day);
      appointmentDate.setHours(hours, minutes, 0, 0);

      appointments.push({
        id: `day${day}-${i + 1}`,
        patientId: patients[Math.floor(Math.random() * patients.length)].id,
        doctorId: doctors[Math.floor(Math.random() * doctors.length)].id,
        dateTime: appointmentDate.toISOString(),
        status: 'scheduled',
        createdAt: new Date(today.getTime() - 1000 * 60 * 60 * 24 * (7 - day)).toISOString()
      });
    }
  }

  for (let day = 1; day <= 14; day++) {
    for (let i = 0; i < 6; i++) {
      const hours = 9 + Math.floor(i / 2);
      const minutes = (i % 2) * 30;
      const appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() - day);
      appointmentDate.setHours(hours, minutes, 0, 0);

      const status =
        Math.random() > 0.8 ? 'cancelled' :
        Math.random() > 0.9 ? 'no-show' : 'completed';

      appointments.push({
        id: `past-day${day}-${i + 1}`,
        patientId: patients[Math.floor(Math.random() * patients.length)].id,
        doctorId: doctors[Math.floor(Math.random() * doctors.length)].id,
        dateTime: appointmentDate.toISOString(),
        status,
        createdAt: new Date(appointmentDate.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString()
      });
    }
  }

  return appointments;
};

export const appointments = generateAppointments();

export const notifications = [
  {
    id: '1',
    title: 'New Appointment',
    message: 'Alice Brown booked an appointment with Dr. Sarah Johnson.',
    type: 'info',
    isRead: false,
    createdAt: new Date(today.getTime() - 1000 * 60 * 30).toISOString()
  },
  {
    id: '2',
    title: 'Appointment Cancelled',
    message: 'Bob Smith cancelled their appointment with Dr. Michael Chen.',
    type: 'warning',
    isRead: true,
    createdAt: new Date(today.getTime() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: '3',
    title: 'Appointment Completed',
    message: 'Dr. Emily Rodriguez completed an appointment with Carol Johnson.',
    type: 'success',
    isRead: false,
    createdAt: new Date(today.getTime() - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: '4',
    title: 'System Maintenance',
    message: 'The system will be down for maintenance tonight from 2-4 AM.',
    type: 'info',
    isRead: true,
    createdAt: new Date(today.getTime() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: '5',
    title: 'New Doctor Onboarded',
    message: 'Dr. Anita Patel has joined the medical team.',
    type: 'success',
    isRead: false,
    createdAt: new Date(today.getTime() - 1000 * 60 * 60 * 24).toISOString()
  },
];

export const availabilities = [];

doctors.forEach(doctor => {
  for (let day = 1; day <= 5; day++) {
    availabilities.push({
      id: `avail-${doctor.id}-${day}-morning`,
      doctorId: doctor.id,
      dayOfWeek: day,
      startTime: '09:00',
      endTime: '12:00',
      isAvailable: true
    });

    availabilities.push({
      id: `avail-${doctor.id}-${day}-afternoon`,
      doctorId: doctor.id,
      dayOfWeek: day,
      startTime: '13:00',
      endTime: '17:00',
      isAvailable: day !== 5 || doctor.id !== '3'
    });
  }

  availabilities.push({
    id: `avail-${doctor.id}-6-morning`,
    doctorId: doctor.id,
    dayOfWeek: 6,
    startTime: '09:00',
    endTime: '12:00',
    isAvailable: doctor.id === '2' || doctor.id === '4'
  });
});

export const getPatientById = (id) => {
  return patients.find(patient => patient.id === id);
};

export const getDoctorById = (id) => {
  return doctors.find(doctor => doctor.id === id);
};

export const getAppointmentsByDoctorId = (doctorId) => {
  return appointments.filter(appointment => appointment.doctorId === doctorId);
};

export const getTodayAppointments = () => {
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  return appointments.filter(
    appointment => appointment.dateTime >= startOfDay && appointment.dateTime <= endOfDay
  );
};

export const getTodayAppointmentsByDoctorId = (doctorId) => {
  return getTodayAppointments().filter(appointment => appointment.doctorId === doctorId);
};

export const getStats = () => {
  const todayAppts = getTodayAppointments();

  return {
    totalUsers: patients.length,
    totalDoctors: doctors.length,
    appointmentsToday: todayAppts.length,
    cancellations: appointments.filter(a => a.status === 'cancelled').length
  };
};
