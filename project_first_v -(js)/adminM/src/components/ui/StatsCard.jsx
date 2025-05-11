function StatsCard({ title, value, icon: Icon, change, changeType = 'positive', className = '' }) {
  const changeColorClass = {
    positive: 'text-success-700',
    negative: 'text-error-700',
    neutral: 'text-gray-500'
  }[changeType]
  
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="mt-1 text-2xl font-semibold text-gray-800">{value}</h3>
          
          {change && (
            <div className={`mt-2 flex items-center text-sm ${changeColorClass}`}>
              <span>{change}</span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className="p-3 rounded-full bg-primary-50 text-primary-600">
            <Icon className="h-8 w-8" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsCard