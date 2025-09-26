import { getDatabase, ref, get } from "firebase/database";
import app from "../config/firebase";

export interface SensorData {
  id?: string; // only for history entries
  Humidity: number;
  PumpStatus: string;
  SoilMoisture: number;
  Temperature: number;
  WaterAlert: string;
  WaterLevelPercent: number;
}

export async function fetchSensorData(): Promise<SensorData[]> {
  try {
    const db = getDatabase(app);

    // 🔹 Fetch current
    const currentSnap = await get(ref(db, "Current"));
    const current = currentSnap.exists()
      ? { id: "current", ...(currentSnap.val() as SensorData) }
      : null;

    // 🔹 Fetch history
    const historySnap = await get(ref(db, "History"));
    const history = historySnap.exists()
      ? Object.entries(historySnap.val()).map(([id, values]) => ({
          id,
          ...(values as SensorData),
        }))
      : [];

    // Merge current + history
    const allData = current ? [current, ...history] : [...history];

    console.log("Fetched all sensor data:", allData);
    return allData;
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return [];
  }
}
