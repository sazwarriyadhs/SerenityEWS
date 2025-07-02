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

// Data is now fetched from the database. This array is no longer used.
export const initialReports: UserReport[] = [];
