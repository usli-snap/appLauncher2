export interface MenuItem {
    MenuID: number;
    LocationID: number;
    ParentID: number;
    SortOrder: number;
    UseProgramRunner: number;
    PermissionTypeID: number;
    Location: string;
    Description: string;
    CommandLine: string;
}

export interface MenuResponse {
    view: MenuItem[];
    errorMessage: string;
}
