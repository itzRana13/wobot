/**
 * Main Application Component
 *
 * Handles camera data fetching, loading states, and error handling.
 * Manages camera list state and delegates UI rendering to CameraTable.
 *
 * @component
 * @returns {JSX.Element} Main application component
 */
import { useState, useEffect } from "react";
import CameraTable from "./components/CameraTable";
import { fetchCameras } from "./services/api";

function App() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCameras();
      // Handle different response formats
      const cameraList = Array.isArray(data)
        ? data
        : data?.data || data?.cameras || [];
      setCameras(cameraList);
    } catch (err) {
      setError("Failed to load cameras. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (cameraId) => {
    setCameras(cameras.filter((camera) => camera.id !== cameraId));
  };

  const handleStatusUpdate = (cameraId, newStatus) => {
    setCameras(
      cameras.map((camera) =>
        camera.id === cameraId ? { ...camera, status: newStatus } : camera
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading cameras...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <CameraTable
        cameras={cameras}
        onDelete={handleDelete}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}

export default App;
