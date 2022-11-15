export class Marker {
    eventType: string;
    county: string;
    latitude: number;
    longitude: number;
    recordedTime: Date;
    description: string;
    street?: string;
    temperature?: number | string;
    windGust?: number;
    precipitationIntensity?: number;
    snowAccumulation?: number;

    constructor(eventType: string,
                county: string,
                latitude: number,
                longitude: number,
                recordedTime: Date,
                description: string,
                street?: string,
                temperature?: number,
                windGust?: number,
                precipitationIntensity?: number,
                snowAccumulation?: number) {
        this.eventType = eventType;
        this.county = county;
        this.latitude = latitude;
        this.longitude = longitude;
        this.recordedTime = recordedTime;
        this.description = description;
        this.street = street ? street : '';
        this.temperature = temperature ? temperature : 'NO DATA';
        this.windGust = windGust ? windGust : 0;
        this.precipitationIntensity = precipitationIntensity ? precipitationIntensity : 0;
        this.snowAccumulation = snowAccumulation ? snowAccumulation : 0;
    }
}
