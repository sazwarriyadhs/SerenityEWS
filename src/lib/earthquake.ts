export interface EarthquakeData {
  magnitude: number;
  location: string;
  depth: number;
  time: string;
  epicenter: string;
}

const getFormattedTime = () => {
    const date = new Date();
    return date.toLocaleString('en-US', {
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
  location: 'Laut Jawa, 90 km Utara Jakarta',
  depth: 22,
  time: getFormattedTime(),
  epicenter: 'Laut Jawa'
};

export const getEarthquakeData = async (): Promise<EarthquakeData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real application, you would fetch this data from an API like https://gis.bnpb.go.id/
  return mockEarthquakeData;
};
