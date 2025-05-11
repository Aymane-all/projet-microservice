import { useState } from 'react'
import { FaBars, FaBell, FaSignOutAlt } from 'react-icons/fa'
import { notifications as mockNotifications } from '../../utils/mockData'

function Header({ user, toggleSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications.slice(0, 5))

  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    // Mark all as read when opening
    if (!showNotifications) {
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    }
  }

  const formatNotificationType = (type) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <FaBars className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Title - visible on mobile only */}
          <h1 className="text-lg font-semibold text-gray-800 md:hidden">
            MediAdmin
          </h1>
          
          {/* Search bar - hidden on mobile */}
          <div className="hidden md:block max-w-xs w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                className="relative p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={handleNotificationClick}
              >
                <span className="sr-only">View notifications</span>
                <FaBell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error-500 ring-2 ring-white"></span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    <div className="mt-2 divide-y divide-gray-100">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div key={notification.id} className="py-3">
                            <p className="text-sm font-medium text-gray-900">
                              {formatNotificationType(notification.type)}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.sentAt}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="py-4 text-sm text-gray-500 text-center">
                          No notifications
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <a
                        href="/notifications"
                        className="block text-sm font-medium text-primary-600 hover:text-primary-500 text-center"
                      >
                        View all notifications
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="ml-3 relative flex items-center">
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={user.avatar}
                  alt={user.name}
                />
                <div className="ml-3 hidden md:block">
                  <div className="text-sm font-medium text-gray-700">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
              </div>
              
              <button 
                className="ml-2 p-1 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                title="Sign out"
              >
                <FaSignOutAlt className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header