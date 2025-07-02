export type Location = 'city' | 'regency';
export type Language = 'en' | 'id';

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  condition: string;
  locationName: string;
}

export interface ForecastDay {
  date: string;
  fullDate: string;
  high: number;
  low: number;
  condition: string;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
}

const getFormattedDate = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().split('T')[0];
}

const getDayName = (offset: number, lang: Language) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    if (offset === 0) return lang === 'id' ? 'Hari ini' : 'Today';
    
    const dayNames: { [key in Language]: string[] } = {
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        id: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    };
    return dayNames[lang][date.getDay()];
}

const generateForecast = (lang: Language, tempOffset: number, conditionSequence: string[]): ForecastDay[] => {
    return Array.from({ length: 7 }).map((_, i) => ({
        date: getDayName(i, lang),
        fullDate: getFormattedDate(i),
        high: 30 - tempOffset - (i % 3),
        low: 22 - tempOffset - (i % 2),
        condition: conditionSequence[i],
    }));
};

const bogorCityDataEn: WeatherData = {
  current: {
    temperature: 28,
    humidity: 75,
    windSpeed: 10,
    windDirection: 'SW',
    condition: 'Sunny',
    locationName: 'Bogor City',
  },
  forecast: generateForecast('en', 0, ['Sunny', 'Partly Cloudy', 'Rainy', 'Sunny', 'Cloudy', 'Rainy', 'Sunny']),
};

const bogorCityDataId: WeatherData = {
  current: {
    temperature: 28,
    humidity: 75,
    windSpeed: 10,
    windDirection: 'BD', // Barat Daya
    condition: 'Cerah',
    locationName: 'Kota Bogor',
  },
  forecast: generateForecast('id', 0, ['Cerah', 'Cerah Berawan', 'Hujan', 'Cerah', 'Berawan', 'Hujan', 'Cerah']),
};


const bogorRegencyDataEn: WeatherData = {
  current: {
    temperature: 26,
    humidity: 82,
    windSpeed: 5,
    windDirection: 'W',
    condition: 'Cloudy',
    locationName: 'Bogor Regency',
  },
  forecast: generateForecast('en', 2, ['Cloudy', 'Rainy', 'Rainy', 'Partly Cloudy', 'Sunny', 'Rainy', 'Cloudy']),
};

const bogorRegencyDataId: WeatherData = {
  current: {
    temperature: 26,
    humidity: 82,
    windSpeed: 5,
    windDirection: 'B', // Barat
    condition: 'Berawan',
    locationName: 'Kabupaten Bogor',
  },
  forecast: generateForecast('id', 2, ['Berawan', 'Hujan', 'Hujan', 'Cerah Berawan', 'Cerah', 'Hujan', 'Berawan']),
};

export const getWeatherData = async (location: Location, lang: Language): Promise<WeatherData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const dataMap = {
      en: {
          city: bogorCityDataEn,
          regency: bogorRegencyDataEn,
      },
      id: {
          city: bogorCityDataId,
          regency: bogorRegencyDataId,
      }
  }
  
  return dataMap[lang][location];
};
