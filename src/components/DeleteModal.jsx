/**
 * DeleteModal Component
 * 
 * A confirmation modal dialog for deleting cameras.
 * Provides a clean, accessible interface for user confirmation.
 * 
 * @component
 * @param {boolean} show - Whether the modal is visible
 * @param {string} cameraName - Name of the camera to delete
 * @param {Function} onConfirm - Callback when delete is confirmed
 * @param {Function} onCancel - Callback when delete is cancelled
 * @returns {JSX.Element|null} Delete confirmation modal
 */
const DeleteModal = ({ show, cameraName, onConfirm, onCancel }) => {
  if (!show) return null;

  // Close modal on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  // Close modal on Escape key
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3
            id="delete-modal-title"
            className="text-lg font-semibold text-gray-900 mb-2"
          >
            Delete Camera
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete{" "}
            <strong>{cameraName}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

