export interface EarthquakeData {
  magnitude: number;
  location: string;
  depth: number;
  time: string;
  epicenter: string;
  epicenterCoords: {
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

const mockEarthquakeData: EarthquakeData = {
  magnitude: 4.8,
  location: 'Java Sea, 90 km North of Jakarta',
  depth: 22,
  time: getFormattedTime(),
  epicenter: 'Java Sea',
  epicenterCoords: {
    latitude: -5.4,
    longitude: 106.8
  }
};

export const getEarthquakeData = async (): Promise<EarthquakeData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real application, you would fetch this data from an API like https://gis.bnpb.go.id/
  return mockEarthquakeData;
};
