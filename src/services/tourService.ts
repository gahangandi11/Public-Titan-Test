import {RouteComponentProps, useLocation} from "react-router";
import {ReactourStep} from "reactour";

const appcentersteps = [
    {
        selector: '.safety',
        content: 'Step 1',
        style: {color: 'black'}
    },
    {
        selector: '.wazeanalytics',
        content: 'Step 2',
        style: {color: 'black'}
    },
    {
        selector: '.transcoreanalytics',
        content: 'Step 3',
        style: {color: 'black'}
    },
    {
        selector: '.crashesshp',
        content: 'Step 4',
        style: {color: 'black'}
    },
    {
        selector: '.motorcycles',
        content: 'Step 5',
        style: {color: 'black'}
    },
    {
        selector: '.crashrisk',
        content: 'Step 6',
        style: {color: 'black'}
    },
    {
        selector: '.probe',
        content: 'Step 7',
        style: {color: 'black'}
    },
    {
        selector: '.trafficcounts',
        content: 'Step 8',
        style: {color: 'black'}
    },
    {
        selector: '.trafficjams',
        content: 'Step 9',
        style: {color: 'black'}
    },
    {
        selector: '.congestion',
        content: 'Step 10',
        style: {color: 'black'}
    },
    {
        selector: '.dailycongestion',
        content: 'Step 11',
        style: {color: 'black'}
    },
    {
        selector: '.winterseverity',
        content: 'Step 12',
        style: {color: 'black'}
    },
    {
        selector: '.incidentclearance',
        content: 'Step 13',
        style: {color: 'black'}
    },
    {
        selector: '.detectorhealth',
        content: 'Step 14',
        style: {color: 'black'}
    },
    {
        selector: '.integrated',
        content: 'Step 15',
        style: {color: 'black'}
    },
    {
        selector: '.workzones',
        content: 'Step 16',
        style: {color: 'black'}
    },
];

const Downloadsteps = [
    {
        selector: '.first-step-tutorial',
        content: 'This is the Probe Data Querying Page. ' ,
        style: {color: 'black'}
    },
    {
        selector: '.second-step-tutorial',
        content: 'Here you can select the desired date range for the data you like to receive.',
        style: {color: 'black'}
    },
];

const Dashboardsteps = [
    {
        selector: '.crashes-tour-main',
        content: 'This card gives information about crashes ',
        style: {color: 'black'}
    },
    {
        selector: '.crashes-tour-gauge',
        content: 'Total number of crashes this week',
        style: {color: 'black'}
    },
    {
        selector: '.crashes-tour-counties',
        content: 'Crashes recorded by each county and also shows the percentage of crashes in each county',
        style: {color: 'black'}
    },
    {
        selector: '.crashes-tour-icon',
        content: 'Click here for more Information',
        style: {color: 'black'}
    },
    {
        selector: '.clearance-tour-main',
        content: 'This card gives information about clearance time',
        style: {color: 'black'}
    },
    {
        selector: '.clearance-tour-gauge',
        content: 'This graph shows the clearance time by each day of the week',
        style: {color: 'black'}
    },
    {
        selector: '.clearance-tour-counties',
        content: 'This section shows clearance time by each county',
        style: {color: 'black'}
    },
    {
        selector: '.clearance-tour-icon',
        content: 'Click here for more information',
        style: {color: 'black'}
    },
    {
        selector: '.freeway-tour-main',
        content: 'This card shows information about freeway counts',
        style: {color: 'black'}
    },
    {
        selector: '.freeway-tour-gauge',
        content: 'This gives information about datarate',
        style: {color: 'black'}
    },
    {
        selector: '.freeway-tour-chart',
        content: 'This bar graph shows freeway counts by highway',
        style: {color: 'black'}
    },
    {
        selector: '.freeway-tour-icon',
        content: 'Click here for more information',
        style: {color: 'black'}
    },
    {
        selector: '.congestion-tour-main',
        content: 'This card gives information about Congestion Miles',
        style: {color: 'black'}
    },
    {
        selector: '.congestion-tour-gauge',
        content: 'This gives information about total congestion miles',
        style: {color: 'black'}
    },
    {
        selector: '.congestion-tour-counties',
        content: 'This shows congestion miles by each county',
        style: {color: 'black'}
    },
    {
        selector: '.congestion-tour-icon',
        content: 'Click here for more information',
        style: {color: 'black'}
    },
];






const tourService = {
    getStepsFor: (stepSet: string): ReactourStep[] => {
       let steps: ReactourStep[] = [];
       switch (stepSet) {
           case 'Downloads':
             steps = Downloadsteps;
             break;
           case 'AppCenter':
               steps = appcentersteps;
               break;
  
    
           case 'Dashboard':
               steps = Dashboardsteps;
               break;
    
           default:
               steps = [{
                   selector: '.error',
                   content: 'Error grabbing Correct tour steps.',
                   style: {color: 'blue'}
               }];
               break;
       }
       return steps;
    },

    StartTour: (): boolean => {
        const query = new URLSearchParams(useLocation().search);
        let isTour: boolean;
        query.get('tour') === '\'true\'' ? isTour = true: isTour = false;
        return isTour;
   },

   StartTourApp: (): boolean => {
    const query = new URLSearchParams(useLocation().search);
    let isTour: boolean;
    query.get('tour') === '\'app-true\'' ? isTour = true: isTour = false;
    return isTour;
   },

   StartTourDashboard: (): boolean => {
    const query = new URLSearchParams(useLocation().search);
    let isTour: boolean;
    query.get('tour') === '\'dash-true\'' ? isTour = true: isTour = false;
    return isTour;
   },

   StartTourData: (): boolean => {
    const query = new URLSearchParams(useLocation().search);
    let isTour: boolean;
    query.get('tour') === '\'data-true\'' ? isTour = true: isTour = false;
    return isTour;
   },



    GoBack: (history: RouteComponentProps["history"]): void => {
        history.push('/Tutorials');
    },

};

export default tourService;
