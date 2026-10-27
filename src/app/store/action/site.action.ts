export class handleSiteList {
    static readonly type = '[Site] get list';
}

export class handleSelectedSite {
    static readonly type = '[Site] selected site';
    constructor(public payload: any) {}
}

export class handleSelectedSiteDetails {
    static readonly type = '[Site] selected site detail';
    constructor(public payload: any) {}
}