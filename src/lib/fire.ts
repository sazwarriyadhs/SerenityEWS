export interface FireData {
  location: string;
  status: 'Contained' | 'Active' | 'Under Control';
  type: string;
  time: string;
  cause: string;
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

const mockFireData: FireData = {
  location: 'Sukaraja, Bogor Regency',
  status: 'Active',
  type: 'Wildfire',
  time: getFormattedTime(),
  cause: 'Lightning strike'
};

export const getFireData = async (): Promise<FireData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockFireData;
};
