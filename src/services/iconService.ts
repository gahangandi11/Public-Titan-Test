import {
    gridOutline,
    gridSharp,
    statsChartOutline,
    statsChartSharp,
    analyticsOutline,
    analyticsSharp,
    alertOutline,
    alertSharp,
    searchOutline,
    searchSharp,
    hourglassOutline,
    hourglassSharp,
    walkSharp,
    walkOutline,
    gitMergeOutline,
    gitMergeSharp,
    informationCircleOutline,
    informationCircleSharp,
    subwayOutline,
    subwaySharp,
    podiumOutline,
    podiumSharp,
    personCircleOutline,
    personCircleSharp,
    personRemoveOutline,
    personRemoveSharp,
    carSportOutline,
    carSportSharp,
    videocamOutline,
    videocamSharp,
    warningOutline,
    warningSharp,
    stopwatchOutline,
    stopwatchSharp,
    addCircleOutline,
    addCircleSharp,
    carOutline,
    carSharp,
    pulseOutline,
    pulseSharp,
    cloudUploadOutline,
    cloudUploadSharp,
    arrowForwardOutline,
    cloudDownloadOutline,
    warning,
    thunderstormOutline,
    thunderstormSharp, arrowForwardSharp
} from 'ionicons/icons';

const iconService = {
    getIcon: (name: string, platform?: string): string => {
        const ios = platform === 'ios';
        switch (name) {
            case 'grid':
                return ios ? gridOutline : gridSharp;
            case 'stats':
                return ios ? statsChartOutline : statsChartSharp;
            case 'analytics':
                return ios ? analyticsOutline : analyticsSharp;
            case 'severeWeather':
                return ios ? thunderstormOutline : thunderstormSharp;
            case 'sportsCar':
                return ios ? carSportOutline : carSportSharp;
            case 'alert':
                return ios ? alertOutline : alertSharp;
            case 'search':
                return ios ? searchOutline : searchSharp;
            case 'hourglass':
                return ios ? hourglassOutline : hourglassSharp;
            case 'walk':
                return ios ? walkOutline : walkSharp;
            case 'git':
                return ios ? gitMergeOutline : gitMergeSharp;
            case 'information':
                return ios ? informationCircleOutline : informationCircleSharp;
            case 'subway':
                return ios ? subwayOutline : subwaySharp;
            case 'podium':
                return ios ? podiumOutline : podiumSharp;
            case 'person':
                return ios ? personCircleOutline : personCircleSharp;
            case 'personRemove':
                return ios ? personRemoveOutline : personRemoveSharp;
            case 'video':
                return ios ? videocamOutline : videocamSharp;
            case 'ionicWarning':
                return ios ? warningOutline : warningSharp;
            case 'stopwatch':
                return ios ? stopwatchOutline : stopwatchSharp;
            case 'add':
                return ios ? addCircleOutline : addCircleSharp;
            case 'car':
                return ios ? carOutline : carSharp;
            case 'pulse':
                return ios ? pulseOutline : pulseSharp;
            case 'cloud':
                return ios ? cloudUploadOutline : cloudUploadSharp;
            case 'arrowForward':
                return ios ? arrowForwardOutline : arrowForwardSharp;
            case 'warning':
                return warning;
            case 'weather':
                return cloudDownloadOutline;
            default:
                return '';
        }

    }
};

export default iconService;
