export interface VolcanoData {
  name: string;
  status: 'Level IV (Awas)' | 'Level III (Siaga)' | 'Level II (Waspada)' | 'Level I (Normal)';
  lastEruption: string;
  recommendations: string[];
  coords: {
    latitude: number;
    longitude: number;
  };
}

const getFormattedTime = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Set activity to about a month ago
    return date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

const mockVolcanoData: VolcanoData = {
  name: 'Mount Salak',
  status: 'Level I (Normal)',
  lastEruption: `Last confirmed eruption in 1938. Minor activity observed on ${getFormattedTime()}`,
  recommendations: [
    'Volcanic activity is at a normal level.',
    'Public and tourists are advised not to approach the crater within a 1 km radius.',
    'Stay alert and follow information from official sources.',
  ],
  coords: {
    latitude: -6.71,
    longitude: 106.73
  }
};

export const getVolcanoData = async (): Promise<VolcanoData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real application, you would fetch this data from an API like https://magma.vsi.esdm.go.id/
  return mockVolcanoData;
};
