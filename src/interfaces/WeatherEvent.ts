export class WeatherEvent {
    id: string;
    county: string;
    timestamp: string;
    weatherCode: number;
    latitude: number;
    longitude: number;
    temperature: number;
    precipitationIntensity: number;
    windGust: number;
    snowAccumulation: number;
    freezingRangeIntensity:number;
    sleetIntensity:number;

    constructor(
        id: string,
        county: string,
        timestamp: string,
        weatherCode: number,
        latitude: number,
        longitude: number,
        temperature: number,
        precipitationIntensity: number,
        windGust: number,
        snowAccumulation: number,
        freezingRangeIntensity: number,
        sleetIntensity: number,
        
        ) {
        this.id = id;
        this.county = county;
        this.timestamp = timestamp;
        this.weatherCode = weatherCode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.temperature = temperature;
        this.precipitationIntensity = precipitationIntensity;
        this.windGust = windGust;
        this.snowAccumulation = snowAccumulation;
        this.freezingRangeIntensity = freezingRangeIntensity;
        this.sleetIntensity = sleetIntensity;
    }
}
