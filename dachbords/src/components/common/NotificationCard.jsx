import React from 'react';
import { notifications } from '/src/data/dummyData.js';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { AlertCircle, Check, Info, BellRing } from 'lucide-react';

const NotificationCard = ({ notification, onClick }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-200';
      case 'warning':
        return 'border-amber-200';
      case 'error':
        return 'border-red-200';
      case 'info':
      default:
        return 'border-blue-200';
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg mb-3 hover:shadow-sm transition-all cursor-pointer 
      ${notification.isRead ? 'bg-white' : 'bg-indigo-50'} ${getBorderColor()}`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
            {!notification.isRead && (
              <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(notification.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export const NotificationsContainer = ({
  notifications,
  title = "Recent Notifications"
}) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
            </p>
          )}
        </div>
        <div className="relative">
          <BellRing className="h-6 w-6 text-gray-500" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">No notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
