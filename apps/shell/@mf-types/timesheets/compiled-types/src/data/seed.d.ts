export type Entry = {
    id: string;
    date: string;
    clientId: string;
    hours: number;
    note: string;
};
export declare const clients: {
    id: string;
    name: string;
}[];
export declare const week: string[];
export declare const entries: Entry[];
