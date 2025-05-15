import React from 'react';
import { UserRound, Calendar, Clock, LogOut } from 'lucide-react';
import SidebarItem from '../common/SidebarItem';
import { useAuth } from '../../context/AuthContext';

const SidebarDoctor = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-indigo-700">MediConnect</h1>
        <p className="text-sm text-gray-500 mt-1">Doctor Portal</p>
      </div>
      
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-xl font-medium text-indigo-700">
                {user?.name?.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-medium">{user?.name}</h2>
            <p className="text-sm text-gray-500">Doctor</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-6 overflow-y-auto">
        <ul>
          <SidebarItem to="/doctor" icon={UserRound} label="My Profile" exact />
          <SidebarItem to="/doctor/appointments" icon={Calendar} label="My Appointments" />
          <SidebarItem to="/doctor/availability" icon={Clock} label="My Availability" />
        </ul>
      </nav>
      
      <div className="p-6 border-t border-gray-200">
        <button 
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarDoctor;
