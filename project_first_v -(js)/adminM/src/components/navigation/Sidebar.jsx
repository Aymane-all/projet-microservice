import { NavLink } from 'react-router-dom'
import { 
  FaHome, 
  FaUsers, 
  FaUserMd, 
  FaCalendarAlt, 
  FaCalendarCheck, 
  FaHistory, 
  FaBell, 
  FaTimes 
} from 'react-icons/fa'

const navigation = [
  { name: 'Dashboard', icon: FaHome, path: '/' },
  { name: 'Users', icon: FaUsers, path: '/users' },
  { name: 'Doctors', icon: FaUserMd, path: '/doctors' },
  { name: 'Time Slots', icon: FaCalendarAlt, path: '/timeslots' },
  { name: 'Appointments', icon: FaCalendarCheck, path: '/appointments' },
  { name: 'History', icon: FaHistory, path: '/history' },
  { name: 'Notifications', icon: FaBell, path: '/notifications' },
]

function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden" 
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 md:relative md:z-0 w-64 bg-white shadow-lg transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Logo and close button */}
        <div className="h-16 flex items-center justify-between px-4 bg-primary-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-white text-primary-700 flex items-center justify-center font-bold text-xl">
              M
            </div>
            <span className="text-white font-semibold text-lg">MediAdmin</span>
          </div>
          
          <button 
            type="button"
            className="md:hidden text-white hover:text-gray-200"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <FaTimes className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 ${
                  isActive 
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  )
}

export default Sidebar