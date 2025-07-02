export interface WhirlwindData {
  location: string;
  category: string;
  windSpeed: number;
  time: string;
  potentialThreat: string;
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

const mockWhirlwindData: WhirlwindData = {
  location: 'Southern Waters of West Java',
  category: 'Tropical Cyclone "Cempaka"',
  windSpeed: 95,
  time: getFormattedTime(),
  potentialThreat: 'Potential for strong winds and heavy rain.',
  epicenterCoords: {
    latitude: -8.5,
    longitude: 107.0
  }
};

export const getWhirlwindData = async (): Promise<WhirlwindData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real application, you would fetch this data from an API like https://gis.bnpb.go.id/ for extreme weather
  return mockWhirlwindData;
};
