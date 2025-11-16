interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const styles: { [key: string]: string } = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-primary-100 border-primary-400 text-primary-700',
  };

  const icons: { [key: string]: string } = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ℹ',
  };

  return (
    <div className={`border-l-4 p-4 ${styles[type]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-3 text-xl font-bold">{icons[type]}</span>
          <p>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xl font-bold hover:opacity-70"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
