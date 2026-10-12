// Pattern 3: branded ids. Two strings that mean different things stop being interchangeable.

// BEFORE: every id is a string, so swapped arguments compile and reminders go to the wrong client.
function sendReminderBefore(invoiceId: string, clientId: string) { return `${invoiceId} -> ${clientId}`; }
const invId = 'inv_42', cliId = 'cli_7';
sendReminderBefore(cliId, invId); // wrong order, no error

// AFTER: brand the primitives. Same runtime value, different compile-time identity.
type Brand<T, B extends string> = T & { readonly __brand: B };
export type InvoiceId = Brand<string, 'InvoiceId'>;
export type ClientId = Brand<string, 'ClientId'>;

export const InvoiceId = (s: string) => s as InvoiceId; // the only place a plain string becomes an InvoiceId
export const ClientId = (s: string) => s as ClientId;

export function sendReminder(invoiceId: InvoiceId, clientId: ClientId) { return `${invoiceId} -> ${clientId}`; }

const invoice = InvoiceId('inv_42');
const client = ClientId('cli_7');
sendReminder(invoice, client);
// @ts-expect-error  arguments swapped: a ClientId is not an InvoiceId
sendReminder(client, invoice);
