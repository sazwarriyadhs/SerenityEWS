import { Sun, Cloud, CloudRain, Snowflake, Cloudy, CloudSun } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  condition: string;
}

export function WeatherIcon({ condition, ...props }: WeatherIconProps) {
  const lowerCaseCondition = condition.toLowerCase();

  if (lowerCaseCondition.includes('sunny') || lowerCaseCondition.includes('clear')) {
    return <Sun {...props} />;
  }
  if (lowerCaseCondition.includes('partly cloudy')) {
    return <CloudSun {...props} />;
  }
  if (lowerCaseCondition.includes('cloudy')) {
    return <Cloud {...props} />;
  }
  if (lowerCaseCondition.includes('rainy') || lowerCaseCondition.includes('rain')) {
    return <CloudRain {...props} />;
  }
  if (lowerCaseCondition.includes('snow')) {
    return <Snowflake {...props} />;
  }
  
  return <Cloudy {...props} />; // Default icon
}
