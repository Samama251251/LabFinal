import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface DeviceData {
  _id: string;
  deviceId: string;
  temperature: number;
  humidity: number;
  timestamp: string;
}

interface DeviceDataContextType {
  deviceData: DeviceData[];
  loading: boolean;
  error: string | null;
  refreshData: (deviceId?: string) => Promise<void>;
}

const DeviceDataContext = createContext<DeviceDataContextType | undefined>(
  undefined
);

export const useDeviceData = () => {
  const context = useContext(DeviceDataContext);
  if (context === undefined) {
    throw new Error("useDeviceData must be used within a DeviceDataProvider");
  }
  return context;
};

interface DeviceDataProviderProps {
  children: ReactNode;
}

export const DeviceDataProvider = ({ children }: DeviceDataProviderProps) => {
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const fetchData = async (deviceId?: string) => {
    try {
      setLoading(true);
      const url = deviceId
        ? `http://localhost:5000/api/data/device/${deviceId}`
        : "http://localhost:5000/api/data/latest";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();

      if (result.success && result.data) {
        setDeviceData(result.data);
        if (deviceId) {
          setSelectedDeviceId(deviceId);
        }
      } else {
        throw new Error(result.error || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching device data:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  // Polling for data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(selectedDeviceId || undefined);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedDeviceId]);

  const value = {
    deviceData,
    loading,
    error,
    refreshData: fetchData,
  };

  return (
    <DeviceDataContext.Provider value={value}>
      {children}
    </DeviceDataContext.Provider>
  );
};
