export class FormRequest {
    uid: string;
    page: string;
    start: string;
    end: string;
    file: string;
    counties: string[];
    attributes?: number[] | null;
    interval?: number | null;
    unit?: number | null;

    constructor(uid: string,
                page: string,
                start: string,
                end: string,
                file: string,
                counties: string[],
                attributes?: number[] | null,
                interval?: number | null,
                unit?: number | null) {
        this.uid = uid;
        this.page = page;
        this.start = start;
        this.end = end;
        this.file = file;
        this.counties = counties;
        this.attributes = attributes ? attributes : [];
        this.interval = interval ? interval : null;
        this.unit = unit ? unit : null;
    }
}
