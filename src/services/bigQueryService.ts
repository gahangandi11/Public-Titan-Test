import {FormRequest} from '../interfaces/FormRequest';
const transcoreURL = 'https://ridsi-api.com/api/data_download/';
let authToken = '';
const website = 'titan';

export function setAuthToken(token: string) {
    authToken = token;
}

const bigQueryService = {
    queryProbeData: (data: FormRequest): Promise<Response> => {
        const request = {
            user: data.uid,
            start: data.start,
            end: data.end,
            flags: data.attributes,
            aggv: data.interval,
            unitsv: data.unit,
            filename: data.file + '.csv',
            counties: data.counties,
            website: website
        };
        return fetch(transcoreURL + 'inrix_probe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': authToken
                },
                body: JSON.stringify(request)
                }
            );
    },
    queryIncidentsData: (data: FormRequest): Promise<Response> => {
        const request = {
            user: data.uid,
            start: data.start,
            end: data.end,
            flags: data.attributes,
            filename: data.file + '.csv',
            counties: data.counties,
            website: website
        };
        return fetch(transcoreURL + 'transcore_incident', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': authToken
                },
                body: JSON.stringify(request)
            }
        );
    },
    queryDetectorData: (data: FormRequest): Promise<Response> => {
        const request = {
            user: data.uid,
            start: data.start,
            end: data.end,
            aggv: data.interval,
            filename: data.file + '.csv',
            counties: data.counties,
            website: website
        };
        return fetch(transcoreURL + 'transcore_detector', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': authToken
                },
                body: JSON.stringify(request)
            }
        );
    },
    queryWazeIncidentData: (data: FormRequest): Promise<Response> => {
        const request = {
            user: data.uid,
            start: data.start,
            end: data.end,
            flags: data.attributes,
            filename: data.file + '.csv',
            counties: data.counties,
            website: website
        };
        return fetch(transcoreURL + 'waze_incident', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': authToken
                },
                body: JSON.stringify(request)
            }
        );
    },
    queryWazeJamData: (data: FormRequest): Promise<Response> => {
        const request = {
            user: data.uid,
            start: data.start,
            end: data.end,
            filename: data.file + '.csv',
            counties: data.counties,
            website: website
        };
        return fetch(transcoreURL + 'waze_jam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': authToken
                },
                body: JSON.stringify(request)
            }
        );
    }
};

export default bigQueryService;
