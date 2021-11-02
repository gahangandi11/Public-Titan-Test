import {CountyData} from './CountyData';

export class DashboardData {
    weeklyCrashes: number;
    clearanceTime: number;
    freewayCounts: number;
    // pti: number;
    countyCrashes: CountyData[];
    dailyCrashCount: number[];
    dailyCrashDay: string[];
    incidentTypeCount: number[];
    incidentTypeName: string[];
    trafficCount: number[];
    lastUpdated: number;

    constructor()
    constructor(weeklyCrashes: number,
                clearanceTime: number,
                freewayCounts: number,
                countyCrashes: CountyData[],
                dailyCrashCount: number[],
                dailyCrashDay: string[],
                incidentTypeCount: number[],
                incidentTypeName: string[],
                trafficCount: number[],
                lastUpdated: number)
    constructor(weeklyCrashes?: number,
                clearanceTime?: number,
                freewayCounts?: number,
                countyCrashes?: CountyData[],
                dailyCrashCount?: number[],
                dailyCrashDay?: string[],
                incidentTypeCount?: number[],
                incidentTypeName?: string[],
                trafficCount?: number[],
                lastUpdated?: number){
        this.weeklyCrashes = weeklyCrashes ? weeklyCrashes : 0;
        this.clearanceTime = clearanceTime ? clearanceTime : 0;
        this.freewayCounts = freewayCounts ? freewayCounts : 0;
        this.countyCrashes = countyCrashes ? countyCrashes : [{name: 'Error retrieving counties', crashes: 0}];
        this.dailyCrashCount = dailyCrashCount ? dailyCrashCount : [0];
        this.dailyCrashDay = dailyCrashDay ? dailyCrashDay : [''];
        this.incidentTypeCount = incidentTypeCount ? incidentTypeCount : [0];
        this.incidentTypeName = incidentTypeName ? incidentTypeName : [''];
        this.trafficCount = trafficCount ? trafficCount : [0];
        this.lastUpdated = lastUpdated ? lastUpdated : 0;
    }
}
