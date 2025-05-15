import React from 'react';
import { Bell, Check } from 'lucide-react';
import { notifications } from '../../data/dummyData';

const NotificationsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg flex items-center hover:bg-indigo-100 transition-colors">
          <Check className="w-5 h-5 mr-2" />
          Mark All as Read
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 flex items-start space-x-4 ${
              notification.isRead ? 'bg-white' : 'bg-indigo-50'
            }`}
          >
            <div className={`p-2 rounded-full ${
              notification.type === 'success' ? 'bg-green-100 text-green-600' :
              notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
              notification.type === 'error' ? 'bg-red-100 text-red-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              <Bell className="w-5 h-5" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
