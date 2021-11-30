export class File {
    uid: string;
    fileName: string;
    location: string;
    type: string;
    ready: boolean;
    queryResponse: string;
    queryDate: string;

    constructor(uid: string,
                fileName: string,
                location: string,
                type: string,
                ready: boolean,
                queryResponse: string,
                queryDate: string) {
        this.uid = uid;
        this.fileName = fileName;
        this.location = location;
        this.type = type;
        this.ready = ready;
        this.queryResponse = queryResponse;
        this.queryDate = queryDate;
    }
}