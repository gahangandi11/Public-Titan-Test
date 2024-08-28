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
    fullAccess?: boolean;
    shortDescription?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phoneNumber?: string;
    companyName?: string;


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
                  fullAccess?: boolean,
                  shortDescription?: string,
                  firstName?: string,
                  middleName?: string,
                  lastName?: string,
                  phoneNumber?: string,
                  companyName?: string,
                  
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
                 fullAccess?: boolean,
                 shortDescription?: string,
                 firstName?: string,
                 middleName?: string,
                 lastName?: string,
                 phoneNumber?: string,
                 companyName?: string,
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
        this.fullAccess=fullAccess? fullAccess : false;
        this.shortDescription=shortDescription?shortDescription : '';
        this.firstName= firstName ? firstName : '';
        this.middleName= middleName ? middleName : '';
        this.lastName= lastName ? lastName : '';
        this.phoneNumber= phoneNumber? phoneNumber: '';
        this.companyName= companyName? companyName: '';
    }
}
