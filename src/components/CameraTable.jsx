/**
 * CameraTable Component
 *
 * Main table component for displaying and managing cameras.
 * Features include search, filtering, pagination, status updates, and deletion.
 *
 * @component
 * @param {Array} cameras - Array of camera objects
 * @param {Function} onDelete - Callback function when a camera is deleted
 * @param {Function} onStatusUpdate - Callback function when camera status is updated
 * @returns {JSX.Element} Camera table component
 */
import { useState, useMemo, useCallback } from "react";
import { updateCameraStatus } from "../services/api";
import BrandLogo from "../assets/Brand Logo.svg";
import CloudIcon from "../assets/Cloud.svg";
import EdgeIcon from "../assets/Edge.svg";
import DeactivateIcon from "../assets/Deactivate.svg";
import HealthBadge from "./HealthBadge";
import DeleteModal from "./DeleteModal";
import StatusTooltip from "./StatusTooltip";
import {
  formatLocation,
  formatRecorder,
  formatTasks,
} from "../utils/formatters";

const CameraTable = ({ cameras, onDelete, onStatusUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCameras, setSelectedCameras] = useState(new Set());
  const [updatingStatus, setUpdatingStatus] = useState(new Set());
  const [tooltip, setTooltip] = useState({
    show: false,
    message: "",
    x: 0,
    y: 0,
  });
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    cameraId: null,
    cameraName: "",
  });

  // Get unique locations and statuses for filters
  const locations = useMemo(() => {
    const locs = new Set();
    cameras.forEach((camera) => {
      if (camera.location) {
        const locationStr =
          typeof camera.location === "string"
            ? camera.location
            : `${camera.location.city || ""}, ${
                camera.location.state || ""
              }`.trim();
        if (locationStr) locs.add(locationStr);
      }
    });
    return Array.from(locs).sort();
  }, [cameras]);

  const statuses = useMemo(() => {
    const stats = new Set();
    cameras.forEach((camera) => {
      if (camera.status) stats.add(camera.status);
    });
    return Array.from(stats).sort();
  }, [cameras]);

  // Filter and search logic
  const filteredCameras = useMemo(() => {
    return cameras.filter((camera) => {
      const matchesSearch =
        !searchTerm ||
        camera.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.model?.toLowerCase().includes(searchTerm.toLowerCase());

      const cameraLocation =
        typeof camera.location === "string"
          ? camera.location
          : `${camera.location?.city || ""}, ${
              camera.location?.state || ""
            }`.trim();
      const matchesLocation =
        !locationFilter || cameraLocation === locationFilter;

      const matchesStatus = !statusFilter || camera.status === statusFilter;

      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [cameras, searchTerm, locationFilter, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCameras.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCameras = filteredCameras.slice(startIndex, endIndex);

  /**
   * Handles page navigation
   * @param {number} page - Page number to navigate to
   */
  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  /**
   * Handles items per page change
   * @param {number} newItemsPerPage - New items per page value
   */
  const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  const handleSelectCamera = (cameraId) => {
    const newSelected = new Set(selectedCameras);
    if (newSelected.has(cameraId)) {
      newSelected.delete(cameraId);
    } else {
      newSelected.add(cameraId);
    }
    setSelectedCameras(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCameras.size === paginatedCameras.length) {
      setSelectedCameras(new Set());
    } else {
      setSelectedCameras(new Set(paginatedCameras.map((c) => c.id)));
    }
  };

  const handleStatusToggle = async (camera, event) => {
    const newStatus = camera.status === "Active" ? "Inactive" : "Active";
    setUpdatingStatus((prev) => new Set(prev).add(camera.id));

    try {
      await updateCameraStatus(camera.id, newStatus);
      onStatusUpdate(camera.id, newStatus);

      // Show success tooltip
      setTooltip({
        show: true,
        message: `Status updated to ${newStatus}`,
      });
      setTimeout(() => setTooltip({ show: false, message: "" }), 2000);
    } catch (error) {
      console.error("Failed to update status:", error);
      // Show error tooltip
      setTooltip({
        show: true,
        message: "Failed to update camera status. Please try again.",
      });
      setTimeout(() => setTooltip({ show: false, message: "" }), 3000);
    } finally {
      setUpdatingStatus((prev) => {
        const next = new Set(prev);
        next.delete(camera.id);
        return next;
      });
    }
  };

  const handleDelete = (cameraId, cameraName) => {
    setDeleteModal({
      show: true,
      cameraId,
      cameraName: cameraName || `Camera ${cameraId}`,
    });
  };

  const confirmDelete = () => {
    if (deleteModal.cameraId) {
      onDelete(deleteModal.cameraId);
      setDeleteModal({ show: false, cameraId: null, cameraName: "" });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, cameraId: null, cameraName: "" });
  };

  /**
   * Renders health icons for a camera (cloud and device status)
   * @param {Object} camera - Camera object with health data
   * @returns {JSX.Element} Health icons component
   */
  const getHealthIcons = useCallback((camera) => {
    // Extract health data from the camera object
    // health structure: { cloud: "A", device: "A" }
    const health = camera.health || {};
    const cloudStatus = health.cloud || "-";
    const deviceStatus = health.device || "-";

    return (
      <>
        <HealthBadge status={cloudStatus} isFirst={true} />
        <img src={EdgeIcon} alt="Edge" className="w-4 h-4 mx-1.5" />
        <HealthBadge status={deviceStatus} isFirst={false} />
      </>
    );
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header with Logo */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-center">
          <img src={BrandLogo} alt="Wobot.ai" className="h-9" />
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cameras</h1>
              <p className="text-gray-600 mt-1">Manage your cameras here.</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
            <div className="relative w-full sm:w-auto">
              <select
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-auto pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
              >
                <option value="">Location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-auto pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
              >
                <option value="">Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                />
              </svg>
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className=" max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                      <input
                        type="checkbox"
                        checked={
                          selectedCameras.size === paginatedCameras.length &&
                          paginatedCameras.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="pl-2 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NAME
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      HEALTH
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      LOCATION
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RECORDER
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TASKS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedCameras.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No cameras found
                      </td>
                    </tr>
                  ) : (
                    paginatedCameras.map((camera) => (
                      <tr key={camera.id} className="hover:bg-gray-50">
                        <td className="pl-6 pr-2 py-4 whitespace-nowrap w-8">
                          <input
                            type="checkbox"
                            checked={selectedCameras.has(camera.id)}
                            onChange={() => handleSelectCamera(camera.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="pl-2 pr-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                camera.status === "Active"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {camera.name || `Camera ${camera.id}`}
                                </span>
                                {camera.pending && (
                                  <svg
                                    className="w-4 h-4 text-orange-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {camera.email || camera.model || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={CloudIcon}
                              alt="Cloud"
                              className="w-4 h-4 mr-1.5"
                            />
                            {getHealthIcons(camera)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatLocation(camera.location)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatRecorder(camera.recorder)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatTasks(camera.tasks)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={(e) => handleStatusToggle(camera, e)}
                            disabled={updatingStatus.has(camera.id)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${
                              camera.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                            title="Click to toggle status"
                          >
                            {updatingStatus.has(camera.id)
                              ? "Updating..."
                              : camera.status || "N/A"}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDelete(camera.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Deactivate"
                          >
                            <img
                              src={DeactivateIcon}
                              alt="Deactivate"
                              className="w-5 h-5"
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  {startIndex + 1}-{Math.min(endIndex, filteredCameras.length)}{" "}
                  of {filteredCameras.length}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    &lt;&lt;
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    &gt;
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    &gt;&gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tooltip */}
      <StatusTooltip show={tooltip.show} message={tooltip.message} />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={deleteModal.show}
        cameraName={deleteModal.cameraName}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default CameraTable;
