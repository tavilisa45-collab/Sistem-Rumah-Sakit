import { getStatusColor } from '../lib/utils';

interface BadgeProps {
  status: string;
  children: React.ReactNode;
}

export function Badge({ status, children }: BadgeProps) {
  const colorClass = getStatusColor(status);
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
    >
      {children}
    </span>
  );
}
