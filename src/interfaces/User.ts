export class User {
    uid: string;
    admin: boolean;
    applied: boolean;
    verified: boolean;
    deviceIDs: string[];
    email?: string | null;
    displayName?: string | null;
    agency?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    allowTracking?: boolean;
    requiresRenewal?:boolean
    registeredDate?:string|null
    renewalDate?:string|null
    subscriptions?: string[];

    constructor()
    constructor (uid: string,
                 admin: boolean,
                 applied: boolean,
                 verified: boolean,
                 deviceIDs: string[],
                 email?: string | null,
                 displayName?: string | null,
                 agency?: string | null,
                 latitude?: number | null,
                 longitude?: number | null,
                 allowTracking?: boolean,
                 subscriptions?: string[],
                 requiresRenewal?:boolean,
                  registeredDate?:string|null,
                  renewalDate?:string|null,
                 )
    constructor (uid?: string,
                 admin?: boolean,
                 applied?: boolean,
                 verified?: boolean,
                 deviceIDs?: string[],
                 email?: string | null,
                 displayName?: string | null,
                 agency?: string | null,
                 latitude?: number | null,
                 longitude?: number | null,
                 allowTracking?: boolean,
                 subscriptions?: string[],
                 requiresRenewal?:boolean,
                 registeredDate?:string|null,
                 renewalDate?:string|null,
                 ){
        this.uid = uid ? uid : '';
        this.email = email ? email : '';
        this.displayName = displayName ? displayName : '';
        this.agency = agency ? agency : '';
        this.admin = admin ? admin : false;
        this.applied = applied ? applied : false;
        this.verified = verified ? verified : false;
        this.requiresRenewal = this.requiresRenewal ? requiresRenewal : false;
        this.latitude = latitude ? latitude : null;
        this.longitude = longitude ? longitude : null;
        this.allowTracking = allowTracking ? allowTracking : false;
        this.subscriptions = subscriptions ? subscriptions : [];
        this.deviceIDs = deviceIDs ? deviceIDs : [];
        this.registeredDate=registeredDate?registeredDate:'';
        this.renewalDate=renewalDate?renewalDate:'';
    }
}
