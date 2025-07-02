export interface VolcanoData {
  name: string;
  status: 'Level IV (Awas)' | 'Level III (Siaga)' | 'Level II (Waspada)' | 'Level I (Normal)';
  lastEruption: string;
  recommendations: string[];
}

const getFormattedTime = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Set activity to about a month ago
    return date.toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

const mockVolcanoData: VolcanoData = {
  name: 'Gunung Salak',
  status: 'Level I (Normal)',
  lastEruption: `Letusan terakhir terkonfirmasi pada 1938. Aktivitas minor terpantau pada ${getFormattedTime()}`,
  recommendations: [
    'Aktivitas vulkanik pada tingkat normal.',
    'Masyarakat dan wisatawan dihimbau untuk tidak mendekati kawah dalam radius 1 km.',
    'Tetap waspada dan ikuti informasi dari sumber resmi.',
  ]
};

export const getVolcanoData = async (): Promise<VolcanoData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real application, you would fetch this data from an API like https://magma.vsi.esdm.go.id/
  return mockVolcanoData;
};
