
class Notes {
    Description: string;
    source: string;

    constructor(Description: string, source: string) {
        this.Description = Description;
        this.source = source;
    }
}

export class DashboardItem {
    notes: Notes;
    value: number;

    constructor(notes: Notes, value: number) {
        this.notes = notes;
        this.value = value;
    }

    static onError(message: string): DashboardItem {
        const errorNotes = new Notes("Error occurred", message);
        return new DashboardItem(errorNotes, 0); 
}
}

