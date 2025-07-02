export interface FireData {
  location: string;
  status: 'Contained' | 'Active' | 'Under Control';
  type: string;
  time: string;
  cause: string;
  coords: {
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

const mockFireData: FireData = {
  location: 'Sentul Industrial Area, Bogor',
  status: 'Under Control',
  type: 'Structural',
  time: getFormattedTime(),
  cause: 'Electrical short circuit',
  coords: {
    latitude: -6.55,
    longitude: 106.85
  }
};

export const getFireData = async (): Promise<FireData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real application, you would fetch this data from an API like https://gis.bnpb.go.id/
  return mockFireData;
};
