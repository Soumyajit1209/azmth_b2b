
import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  interactive?: boolean;
  glass?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  className,
  title,
  icon,
  onClick,
  interactive = false,
  glass = false,
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden",
        glass && "glass-panel",
        interactive && "card-hover cursor-pointer",
        className
      )}
      onClick={interactive ? onClick : undefined}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between gap-2 border-b p-4">
          {title && <h3 className="font-semibold text-lg">{title}</h3>}
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
