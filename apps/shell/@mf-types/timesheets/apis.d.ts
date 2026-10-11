
    export type RemoteKeys = 'timesheets/App';
    type PackageType<T> = T extends 'timesheets/App' ? typeof import('timesheets/App') :any;