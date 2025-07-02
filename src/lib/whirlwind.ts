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
  location: 'Perairan Selatan Jawa Barat',
  category: 'Siklon Tropis "Cempaka"',
  windSpeed: 95,
  time: getFormattedTime(),
  potentialThreat: 'Potensi angin kencang dan hujan lebat.'
};

export const getWhirlwindData = async (): Promise<WhirlwindData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real application, you would fetch this data from an API like https://gis.bnpb.go.id/ for extreme weather
  return mockWhirlwindData;
};
