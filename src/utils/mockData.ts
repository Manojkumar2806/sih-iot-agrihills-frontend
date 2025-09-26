import type { SensorData } from '../types';

export const generateMockSensorData = (count: number = 24): SensorData[] => {
  const data: SensorData[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - 1 - i) * 60000); // 1 minute intervals
    
    data.push({
      id: `sensor_${timestamp.getTime()}`,
      timestamp,
      temperature: Math.round((20 + Math.random() * 15 + Math.sin(i * 0.1) * 3) * 10) / 10,
      humidity: Math.round((40 + Math.random() * 30 + Math.sin(i * 0.15) * 10) * 10) / 10,
      pressure: Math.round((1000 + Math.random() * 50 + Math.sin(i * 0.05) * 20) * 10) / 10,
      lightLevel: Math.round((Math.random() * 1000 + Math.sin(i * 0.2) * 200) * 10) / 10,
      motionDetected: Math.random() > 0.7,
      airQuality: Math.round((50 + Math.random() * 50 + Math.sin(i * 0.12) * 25) * 10) / 10,
      deviceId: 'sensor_001'
    });
  }

  return data;
};