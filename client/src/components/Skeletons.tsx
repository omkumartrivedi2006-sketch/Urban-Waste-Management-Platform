import React from 'react';

// Single animated shimmer bar
export const SkeletonBar: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded-lg ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
};

// Shimmer card component
export const SkeletonCard: React.FC = () => {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-soft space-y-4">
      <div className="flex items-center space-x-3">
        <SkeletonBar className="w-12 h-12 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <SkeletonBar className="w-1/3 h-5" />
          <SkeletonBar className="w-1/4 h-3.5" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonBar className="h-4" />
        <SkeletonBar className="h-4" />
        <SkeletonBar className="w-5/6 h-4" />
      </div>
      <div className="pt-2 flex justify-between items-center">
        <SkeletonBar className="w-20 h-8 rounded-xl" />
        <SkeletonBar className="w-24 h-4" />
      </div>
    </div>
  );
};

// Shimmer table/list row
export const SkeletonRow: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-50">
      <div className="flex items-center space-x-4 flex-1">
        <SkeletonBar className="w-10 h-10 rounded-full" />
        <div className="space-y-2 flex-1 max-w-xs">
          <SkeletonBar className="h-4 w-3/4" />
          <SkeletonBar className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex space-x-3 items-center">
        <SkeletonBar className="w-16 h-6 rounded-full" />
        <SkeletonBar className="w-8 h-8 rounded-lg" />
      </div>
    </div>
  );
};

// Shimmer list (multiple cards)
export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
