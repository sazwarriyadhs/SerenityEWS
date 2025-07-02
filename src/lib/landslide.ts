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
  location: 'Cisarua, Bogor Regency',
  riskLevel: 'Moderate',
  trigger: 'Curah hujan intensitas tinggi',
  time: getFormattedTime(),
  potentialImpact: 'Berpotensi menutup akses jalan utama.'
};

export const getLandslideData = async (): Promise<LandslideData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
    // In a real application, you would fetch this data from an API like https://gis.bnpb.go.id/
  return mockLandslideData;
};
