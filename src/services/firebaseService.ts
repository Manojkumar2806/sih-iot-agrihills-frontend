import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { SensorData } from '../types';

const COLLECTION_NAME = 'sensorData';

export const addSensorData = async (data: Omit<SensorData, 'id' | 'timestamp'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      timestamp: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding sensor data:', error);
    throw error;
  }
};

export const getSensorData = async (limitCount: number = 50): Promise<SensorData[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const data: SensorData[] = [];

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      data.push({
        id: doc.id,
        ...docData,
        timestamp: docData.timestamp?.toDate?.() || null,
      } as SensorData);
    });
    return data.reverse(); // chronological order
  } catch (error) {
    console.error('Error getting sensor data:', error);
    return [];
  }
};


export const subscribeToSensorData = (
  callback: (data: SensorData[]) => void,
  limitCount: number = 50
) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  return onSnapshot(q, (querySnapshot) => {
    const data: SensorData[] = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      data.push({
        id: doc.id,
        ...docData,
        timestamp: docData.timestamp.toDate()
      } as SensorData);
    });
    callback(data.reverse());
  });
};