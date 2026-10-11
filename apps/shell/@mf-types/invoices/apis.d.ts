
    export type RemoteKeys = 'invoices/App';
    type PackageType<T> = T extends 'invoices/App' ? typeof import('invoices/App') :any;