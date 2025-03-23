
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  className,
  formatter = (value) => value.toString()
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    const startValue = displayValue;
    const endValue = value;
    
    const animateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = Math.floor(progress * (endValue - startValue) + startValue);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        window.requestAnimationFrame(animateValue);
      }
    };
    
    window.requestAnimationFrame(animateValue);
    
    return () => {
      startTime = null;
    };
  }, [value, duration]);
  
  return (
    <span className={cn("tabular-nums", className)}>
      {formatter(displayValue)}
    </span>
  );
};
