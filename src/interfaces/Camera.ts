export class Camera {
    active: number;
    description: string;
    direction: string;
    id: number;
    latitude: number;
    longitude: number;
    mrm: number;
    route: number;
    https_url: string;
    ios_Url: string;

    constructor()
    constructor(active: number,
                description: string,
                direction: string,
                id: number,
                latitude: number,
                longitude: number,
                mrm: number,
                route: number,
                https_url: string,
                ios_Url: string)
    constructor(active?: number,
                description?: string,
                direction?: string,
                id?: number,
                latitude?: number,
                longitude?: number,
                mrm?: number,
                route?: number,
                https_url?: string,
                ios_Url?: string){
        this.active = active ? active : 0;
        this.description = description ? description : '';
        this.direction = direction ? direction : '';
        this.id = id ? id : -1;
        this.latitude = latitude ? latitude : -1;
        this.longitude = longitude ? longitude : -1;
        this.mrm = mrm ? mrm : -1;
        this.route = route ? route : -1;
        this.https_url = https_url ? https_url : '';
        this.ios_Url = ios_Url ? ios_Url : '';
    }
}
