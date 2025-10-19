
import React from 'react';

interface StatCardProps {
  title: string;
  children: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, children }) => {
  return (
    <div className="bg-light-card dark:bg-dark-card px-4 py-5 shadow-lg rounded-lg overflow-hidden sm:p-6">
      <dt className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary truncate">
        {title}
      </dt>
      <dd className="mt-1 text-2xl font-semibold text-light-text dark:text-dark-text">
        {children}
      </dd>
    </div>
  );
};

export default StatCard;
