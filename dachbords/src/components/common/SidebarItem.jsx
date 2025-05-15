import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ to, icon: Icon, label, exact = false }) => {
  return (
    <li>
      <NavLink 
        to={to} 
        end={exact}
        className={({ isActive }) => 
          `flex items-center p-3 mb-2 transition-all duration-150 rounded-lg
          ${isActive 
            ? 'bg-indigo-100 text-indigo-800 font-medium' 
            : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
          }`
        }
      >
        <Icon className="w-5 h-5 mr-3" />
        <span>{label}</span>
      </NavLink>
    </li>
  );
};

export default SidebarItem;
