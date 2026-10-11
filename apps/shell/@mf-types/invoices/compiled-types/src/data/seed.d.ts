export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
export type Invoice = {
    id: string;
    number: string;
    clientId: string;
    clientName: string;
    issued: string;
    due: string;
    totalCents: number;
    status: InvoiceStatus;
};
export declare const clients: {
    id: string;
    name: string;
}[];
export declare const invoices: Invoice[];
export declare const unbilledHoursAtStart = 11.5;
