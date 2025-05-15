import { WeatherProps } from '@/lib/props';
import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow } from 'lucide-react';



export const Weather = ({ temperature, weather, location }: WeatherProps) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div>
                { weather === 'sunny' && <Sun /> }
                { weather === 'cloudy' && <Cloud /> }
                { weather === 'rainy' && <CloudRain /> }
                { weather === 'snowy' && <CloudSnow /> }
                { weather === 'thunderstorm' && <CloudLightning /> }
                <h2 className="text-2xl font-bold">{location}</h2>
                <p className="text-4xl font-bold">{temperature}°F</p>
                <p className="text-2xl font-bold">{weather}</p>
            </div>
        </div>
    )
}