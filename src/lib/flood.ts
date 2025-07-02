export interface FloodData {
  location: string;
  waterLevel: number;
  status: 'Siaga 1 (Awas)' | 'Siaga 2 (Siaga)' | 'Siaga 3 (Waspada)' | 'Siaga 4 (Normal)';
  time: string;
  damCoords: {
    latitude: number;
    longitude: number;
  };
}

const getFormattedTime = () => {
    const date = new Date();
    return date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

const mockFloodData: FloodData = {
  location: 'Katulampa Dam, Bogor',
  waterLevel: 70, // in cm
  status: 'Siaga 4 (Normal)',
  time: getFormattedTime(),
  damCoords: {
    latitude: -6.63,
    longitude: 106.84
  }
};

export const getFloodData = async (): Promise<FloodData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real application, you would fetch this data from an API like https://poskobanjir.dsdadki.web.id/
  return mockFloodData;
};
