import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../components/admin/SidebarAdmin';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for large screens */}
      <div className="hidden md:block md:w-64 flex-shrink-0">
        <SidebarAdmin />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        
        {/* Bottom navigation for mobile */}
        <div className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
          <div className="flex justify-around items-center h-16">
            <a href="/admin" className="flex flex-col items-center justify-center w-full h-full text-indigo-600">
              <span className="text-xs">Dashboard</span>
            </a>
            <a href="/admin/appointments" className="flex flex-col items-center justify-center w-full h-full text-gray-500">
              <span className="text-xs">Appointments</span>
            </a>
            <a href="/admin/users" className="flex flex-col items-center justify-center w-full h-full text-gray-500">
              <span className="text-xs">Users</span>
            </a>
            <a href="/admin/notifications" className="flex flex-col items-center justify-center w-full h-full text-gray-500">
              <span className="text-xs">Notifications</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
