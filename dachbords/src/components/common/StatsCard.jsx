import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  description
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700'
  };
  
  const iconBgClass = colorClasses[color];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${iconBgClass}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
