export type Location = 'city' | 'regency';

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

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const getDayName = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    if (offset === 0) return 'Today';
    return dayNames[date.getDay()];
}

const bogorCityData: WeatherData = {
  current: {
    temperature: 28,
    humidity: 75,
    windSpeed: 10,
    windDirection: 'SW',
    condition: 'Sunny',
    locationName: 'Bogor City',
  },
  forecast: [
    { date: getDayName(0), fullDate: getFormattedDate(0), high: 30, low: 22, condition: 'Sunny' },
    { date: getDayName(1), fullDate: getFormattedDate(1), high: 29, low: 21, condition: 'Partly Cloudy' },
    { date: getDayName(2), fullDate: getFormattedDate(2), high: 27, low: 20, condition: 'Rainy' },
    { date: getDayName(3), fullDate: getFormattedDate(3), high: 31, low: 23, condition: 'Sunny' },
    { date: getDayName(4), fullDate: getFormattedDate(4), high: 28, low: 21, condition: 'Cloudy' },
    { date: getDayName(5), fullDate: getFormattedDate(5), high: 26, low: 20, condition: 'Rainy' },
    { date: getDayName(6), fullDate: getFormattedDate(6), high: 29, low: 22, condition: 'Sunny' },
  ],
};

const bogorRegencyData: WeatherData = {
  current: {
    temperature: 26,
    humidity: 82,
    windSpeed: 5,
    windDirection: 'W',
    condition: 'Cloudy',
    locationName: 'Bogor Regency',
  },
  forecast: [
    { date: getDayName(0), fullDate: getFormattedDate(0), high: 28, low: 20, condition: 'Cloudy' },
    { date: getDayName(1), fullDate: getFormattedDate(1), high: 27, low: 19, condition: 'Rainy' },
    { date: getDayName(2), fullDate: getFormattedDate(2), high: 26, low: 19, condition: 'Rainy' },
    { date: getDayName(3), fullDate: getFormattedDate(3), high: 29, low: 21, condition: 'Partly Cloudy' },
    { date: getDayName(4), fullDate: getFormattedDate(4), high: 28, low: 20, condition: 'Sunny' },
    { date: getDayName(5), fullDate: getFormattedDate(5), high: 25, low: 18, condition: 'Rainy' },
    { date: getDayName(6), fullDate: getFormattedDate(6), high: 28, low: 20, condition: 'Cloudy' },
  ],
};

export const getWeatherData = async (location: Location): Promise<WeatherData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  if (location === 'city') {
    return bogorCityData;
  }
  return bogorRegencyData;
};
