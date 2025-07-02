export interface WhirlwindData {
  location: string;
  category: string;
  windSpeed: number;
  time: string;
  potentialThreat: string;
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

const mockWhirlwindData: WhirlwindData = {
  location: 'Coastal area near Bogor, West Java',
  category: 'Tropical Storm "Anggrek"',
  windSpeed: 85,
  time: getFormattedTime(),
  potentialThreat: 'Heavy rainfall, strong winds, and potential for coastal flooding.'
};

export const getWhirlwindData = async (): Promise<WhirlwindData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockWhirlwindData;
};
