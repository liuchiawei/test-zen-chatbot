import { WeatherProps } from '@/lib/props';
import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow } from 'lucide-react';



export const Weather = ({ temperature, weather, location }: WeatherProps) => {
    return (
        <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center justify-center p-6 bg-stone-100/50 dark:bg-stone-700/50 rounded-xl shadow-md">
                { weather === 'sunny' && <Sun /> }
                { weather === 'cloudy' && <Cloud /> }
                { weather === 'rainy' && <CloudRain /> }
                { weather === 'snowy' && <CloudSnow /> }
                { weather === 'thunderstorm' && <CloudLightning /> }
            </div>
            <div>
                <h2 className="text-xl font-bold text-stone-300 dark:text-stone-700">{location}</h2>
                <p className="text-4xl font-bold">{temperature}°F</p>
            </div>
        </div>
    )
}