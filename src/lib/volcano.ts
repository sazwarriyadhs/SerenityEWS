export interface VolcanoData {
  name: string;
  status: 'Level IV (Awas)' | 'Level III (Siaga)' | 'Level II (Waspada)' | 'Level I (Normal)';
  lastEruption: string;
  recommendations: string[];
}

const getFormattedTime = () => {
    const date = new Date();
    date.setDate(date.getDate() - 2); // Set activity to a couple of days ago
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const mockVolcanoData: VolcanoData = {
  name: 'Gunung Merapi',
  status: 'Level III (Siaga)',
  lastEruption: getFormattedTime(),
  recommendations: [
    'Masyarakat agar tidak melakukan kegiatan apapun di daerah potensi bahaya.',
    'Masyarakat agar mengantisipasi gangguan akibat abu vulkanik dari erupsi.',
    'Masyarakat agar mewaspadai bahaya lahar terutama saat terjadi hujan di seputar puncak.',
  ]
};

export const getVolcanoData = async (): Promise<VolcanoData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real application, you would fetch this data from an API like https://magma.vsi.esdm.go.id/
  return mockVolcanoData;
};
