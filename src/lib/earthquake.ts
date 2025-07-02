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
  magnitude: 5.2,
  location: '150 km Southwest of Bogor, West Java',
  depth: 10,
  time: getFormattedTime(),
  epicenter: 'Bogor Regency'
};

export const getEarthquakeData = async (): Promise<EarthquakeData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockEarthquakeData;
};
