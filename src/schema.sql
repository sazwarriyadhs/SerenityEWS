-- Hapus tabel jika sudah ada
DROP TABLE IF EXISTS reports;

-- Buat ekstensi jika belum ada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Buat tabel untuk laporan pengguna
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    photo_data_uri TEXT NOT NULL,
    description TEXT NOT NULL,
    location JSONB,
    category VARCHAR(255),
    summary TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "user" VARCHAR(255),
    photo_hint VARCHAR(255)
);

-- Contoh data laporan tanah longsor
INSERT INTO reports(photo_data_uri, description, location, category, summary, timestamp, "user", photo_hint)
VALUES(
    'https://placehold.co/800x600.png',
    'Tim SAR melakukan pencarian dua orang korban tanah longsor di Gang Barjo, Kelurahan Kebon Kalapa, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat, Jumat (14/10/2022). Sebanyak delapan orang warga Gang Barjo, Kampung Kebon Jahe, Kelurahan Kebon Kalapa, Kecamatan Bogor Tengah, Kota Bogor, tertimbun longsor',
    '{"latitude": -6.602, "longitude": 106.798}',
    'Tanah Longsor',
    'Tim SAR mencari korban yang tertimbun longsor di Gang Barjo, Bogor Tengah, setelah delapan orang dilaporkan tertimbun.',
    '2022-10-14 12:00:00Z',
    'Tim SAR',
    'landslide rescue'
);