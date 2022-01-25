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
    crashTrend: string;
    crashVal: number;
    crashes_monthly: string[];
    crashes_monthly_values: number[];
    crashes_quarterly: string[];
    crashes_quarterly_values: number[];
    fatalTrend: string;
    fatalVal: number;
    fatal_monthly: string[];
    fatal_monthly_values: number[];
    fatal_quarterly: string[];
    fatal_quarterly_values: number[];
    safetyDevice: number;
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
                crashTrend: string,
                crashVal: number,
                crashes_monthly: string[],
                crashes_monthly_values: number[],
                crashes_quarterly: string[],
                crashes_quarterly_values: number[],
                fatalTrend: string,
                fatalVal: number,
                fatal_monthly: string[],
                fatal_monthly_values: number[],
                fatal_quarterly: string[],
                fatal_quarterly_values: number[],
                safetyDevice: number,
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
                crashTrend?: string,
                crashVal?: number,
                crashes_monthly?: string[],
                crashes_monthly_values?: number[],
                crashes_quarterly?: string[],
                crashes_quarterly_values?: number[],
                fatalTrend?: string,
                fatalVal?: number,
                fatal_monthly?: string[],
                fatal_monthly_values?: number[],
                fatal_quarterly?: string[],
                fatal_quarterly_values?: number[],
                safetyDevice?: number,
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
        this.crashTrend = crashTrend ? crashTrend : '';
        this.crashVal = crashVal ? crashVal : 0;
        this.crashes_monthly = crashes_monthly ? crashes_monthly : [''];
        this.crashes_monthly_values = crashes_monthly_values ? crashes_monthly_values : [0];
        this.crashes_quarterly = crashes_quarterly ? crashes_quarterly : [''];
        this.crashes_quarterly_values = crashes_quarterly_values ? crashes_quarterly_values : [0];
        this.fatalTrend = fatalTrend ? fatalTrend : '';
        this.fatalVal = fatalVal ? fatalVal : 0;
        this.fatal_monthly = fatal_monthly ? fatal_monthly : [''];
        this.fatal_monthly_values = fatal_monthly_values ? fatal_monthly_values : [0];
        this.fatal_quarterly = fatal_quarterly ? fatal_quarterly : [''];
        this.fatal_quarterly_values = fatal_quarterly_values ? fatal_quarterly_values : [0];
        this.safetyDevice = safetyDevice ? safetyDevice : 0;
        this.lastUpdated = lastUpdated ? lastUpdated : 0;
    }
}
