export interface LandslideData {
  location: string;
  riskLevel: 'High' | 'Moderate' | 'Low';
  trigger: string;
  time: string;
  potentialImpact: string;
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

const mockLandslideData: LandslideData = {
  location: 'Puncak Pass, Bogor Regency',
  riskLevel: 'High',
  trigger: 'Prolonged heavy rainfall',
  time: getFormattedTime(),
  potentialImpact: 'Road closure and potential damage to nearby structures.'
};

export const getLandslideData = async (): Promise<LandslideData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockLandslideData;
};
