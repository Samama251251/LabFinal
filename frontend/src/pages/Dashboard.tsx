import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiThermometer,
  FiDroplet,
  FiRefreshCw,
  FiClock,
  FiActivity,
  FiLogOut,
} from "react-icons/fi";
import { useDeviceData } from "../context/DeviceDataContext";
import DeviceChart from "../components/DeviceChart";
import DeviceFilter from "../components/DeviceFilter";
import LiveStatusIndicator from "../components/LiveStatusIndicator";

interface DashboardProps {
  userRole: "admin" | "user" | null;
  setIsAuthenticated: (value: boolean) => void;
}

function Dashboard({ userRole, setIsAuthenticated }: DashboardProps) {
  const { deviceData, loading, error, refreshData } = useDeviceData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData(selectedDeviceId || undefined);
    setTimeout(() => setIsRefreshing(false), 500); // Visual feedback
  };

  const handleDeviceFilter = async (deviceId: string | null) => {
    setSelectedDeviceId(deviceId);
    await refreshData(deviceId || undefined);
  };

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem("token");
    // Update authentication state
    setIsAuthenticated(false);
    // Redirect to login page
    navigate("/login");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-base-100">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-base-100/80 border-b border-base-300 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">IoT Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-base-content/70">Role: {userRole}</span>
            {deviceData.length > 0 && (
              <LiveStatusIndicator lastUpdated={deviceData[0].timestamp} />
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`btn btn-circle btn-ghost ${
                isRefreshing ? "animate-spin" : ""
              }`}
              onClick={handleRefresh}
              aria-label="Refresh data"
            >
              <FiRefreshCw className="text-primary" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-circle btn-ghost"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <FiLogOut className="text-error" />
            </motion.button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading && deviceData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
            <p className="text-base-content/70">Loading device data...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <FiActivity className="w-6 h-6" />
            <span>Error: {error}</span>
          </div>
        ) : deviceData.length === 0 ? (
          <div className="alert alert-info">
            <FiActivity className="w-6 h-6" />
            <span>
              No device data available. Please add some data from the admin
              console.
            </span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {deviceData.length > 0 && (
                <>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="card bg-base-100 shadow-xl border border-base-300"
                  >
                    <div className="card-body">
                      <h2 className="card-title text-base-content flex items-center gap-2">
                        <FiThermometer className="text-primary text-2xl" />
                        Temperature
                      </h2>
                      <div className="flex flex-col items-center h-32 mb-4">
                        <p className="text-5xl font-bold text-primary mt-2">
                          {deviceData[0].temperature}°C
                        </p>
                        <p className="text-base-content/60 mt-2">
                          <FiClock className="inline mr-1" />
                          {formatDate(deviceData[0].timestamp)}
                        </p>
                      </div>

                      {/* Temperature Chart */}
                      <DeviceChart data={deviceData} type="temperature" />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="card bg-base-100 shadow-xl border border-base-300"
                  >
                    <div className="card-body">
                      <h2 className="card-title text-base-content flex items-center gap-2">
                        <FiDroplet className="text-info text-2xl" />
                        Humidity
                      </h2>
                      <div className="flex flex-col items-center h-32 mb-4">
                        <p className="text-5xl font-bold text-info mt-2">
                          {deviceData[0].humidity}%
                        </p>
                        <p className="text-base-content/60 mt-2">
                          <FiClock className="inline mr-1" />
                          {formatDate(deviceData[0].timestamp)}
                        </p>
                      </div>

                      {/* Humidity Chart */}
                      <DeviceChart data={deviceData} type="humidity" />
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="card bg-base-100 shadow-xl border border-base-300"
            >
              <div className="card-body">
                <h2 className="card-title text-base-content mb-4">
                  Device Data History
                </h2>
                <div className="flex justify-end mb-4">
                  <DeviceFilter
                    data={deviceData}
                    onFilterChange={handleDeviceFilter}
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead className="bg-base-200">
                      <tr>
                        <th className="text-base-content">Device ID</th>
                        <th className="text-base-content">Temperature</th>
                        <th className="text-base-content">Humidity</th>
                        <th className="text-base-content">Timestamp</th>
                        <th className="text-base-content">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deviceData.map((device) => (
                        <motion.tr
                          key={device._id}
                          variants={itemVariants}
                          className="hover:bg-base-200"
                        >
                          <td className="text-base-content/80">
                            {device.deviceId}
                          </td>
                          <td className="text-base-content/80">
                            <span className="flex items-center">
                              <FiThermometer className="text-primary mr-2" />
                              {device.temperature}°C
                            </span>
                          </td>
                          <td className="text-base-content/80">
                            <span className="flex items-center">
                              <FiDroplet className="text-info mr-2" />
                              {device.humidity}%
                            </span>
                          </td>
                          <td className="text-base-content/80">
                            {formatDate(device.timestamp)}
                          </td>
                          <td className="text-base-content/80">
                            <LiveStatusIndicator
                              lastUpdated={device.timestamp}
                            />
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
