import React from 'react';

const statusColorMap = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  verified: 'bg-green-100 text-green-800',
  unverified: 'bg-red-100 text-red-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-purple-100 text-purple-800',
  failed: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-800',
};

const StatusBadge = ({ status, children }) => {
  const colorClass = statusColorMap[status?.toLowerCase()] || statusColorMap.default;
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {children || status}
    </span>
  );
};

export default StatusBadge;