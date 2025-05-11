function StatusBadge({ status, className = '' }) {
  const statusStyles = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    'no-show': 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    available: 'bg-green-100 text-green-800',
    unavailable: 'bg-red-100 text-red-800',
    read: 'bg-gray-100 text-gray-800',
    unread: 'bg-blue-100 text-blue-800',
  }
  
  const style = statusStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${style} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default StatusBadge