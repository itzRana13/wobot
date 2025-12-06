/**
 * StatusTooltip Component
 * 
 * Displays a notification tooltip at the top-right corner of the screen.
 * Shows success (green) or error (red) messages with appropriate icons.
 * 
 * @component
 * @param {boolean} show - Whether the tooltip is visible
 * @param {string} message - Message to display
 * @returns {JSX.Element|null} Status tooltip component
 */
const StatusTooltip = ({ show, message }) => {
  if (!show) return null;

  const isError = message.includes("Failed");
  const bgColor = isError ? "#DC2626" : "#10B981";

  return (
    <div
      className="fixed z-[9999] px-4 py-3 text-white text-sm rounded-lg shadow-xl pointer-events-none animate-fade-in"
      style={{
        right: "20px",
        top: "20px",
        backgroundColor: bgColor,
        minWidth: "250px",
      }}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        {isError ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default StatusTooltip;

