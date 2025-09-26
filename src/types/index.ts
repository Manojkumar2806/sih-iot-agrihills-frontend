export interface SensorData {
  temperature: number;        // e.g., 29.1
  humidity: number;           // e.g., 71
  pumpStatus: string;         // e.g., "ON"
  soilMoisture: number;       // e.g., 4095
  waterAlert: string;         // e.g., "Sensor Error"
  waterLevelPercent: number;  // e.g., -1
  id?: string;                // Firestore doc id (optional)
  timestamp?: Date;           // Firestore timestamp (optional)
}





export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}