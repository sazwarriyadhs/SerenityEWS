export interface UserReport {
    id: string;
    photoDataUri: string;
    description: string;
    location: {
        latitude: number;
        longitude: number;
    } | null;
    category: string;
    summary: string;
    timestamp: string;
    user: string; // For now, just a mock user
    photoUrl?: string;
    photoHint?: string;
}

// Initial mock data - this will be mutated by new submissions
export const initialReports: UserReport[] = [
    {
        id: '1',
        photoUrl: `https://placehold.co/600x400.png`,
        photoDataUri: '',
        description: 'Terjadi genangan air di Jalan Sudirman setelah hujan deras. Ketinggian air sekitar 30cm.',
        location: { latitude: -6.595018, longitude: 106.8063 },
        category: 'Banjir',
        summary: 'Genangan air setinggi 30cm di Jalan Sudirman menyebabkan kemacetan lalu lintas.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        user: 'Warga Bogor',
        photoHint: 'street flood',
    },
    {
        id: '2',
        photoUrl: `https://placehold.co/600x400.png`,
        photoDataUri: '',
        description: 'Ada pohon tumbang di dekat Taman Sempur, menghalangi sebagian jalan.',
        location: { latitude: -6.5900, longitude: 106.7918 },
        category: 'Pohon Tumbang',
        summary: 'Pohon tumbang di dekat Taman Sempur menyebabkan penyempitan jalan.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        user: 'Pengguna Jalan',
        photoHint: 'fallen tree',
    },
];
