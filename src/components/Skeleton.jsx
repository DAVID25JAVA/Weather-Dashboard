import React from "react";

export const SkeletonCard = ({ className = "" }) => (
  <div className={`skeleton rounded-2xl ${className}`} />
);

export const SkeletonGrid = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonCard key={i} className="h-28" />
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="skeleton rounded-2xl h-56 w-full" />
);