import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  showLabel = false
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const heightMap = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-xs uppercase tracking-widest text-[#330C2F]">Progress</span>
          <span className="font-bold text-xs text-[#330C2F]">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={`w-full bg-[#F7F7FB] border-[3px] border-[#330C2F] rounded-full overflow-hidden ${heightMap[size]} relative`}>
        <div
          className="bg-[#7B287D] h-full border-r-[3px] border-[#330C2F] transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
