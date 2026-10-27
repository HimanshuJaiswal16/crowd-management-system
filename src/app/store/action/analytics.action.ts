export class handleFootfall {
    static readonly type = '[FootFall] get footfall';
    constructor(public payload: any) {}
}

export class handleDwell {
    static readonly type = '[Dwell] get dwell';
    constructor(public payload: any) {}
}

export class handleOccupancy {
    static readonly type = '[Occupancy] get occupancy';
    constructor(public payload: any) {}
}

export class handleDemographics {
    static readonly type = '[Demographics] get demographics';
    constructor(public payload: any) {}
}

export class handleEntryExit {
    static readonly type = '[EntryExit] get entry-exit';
    constructor(public payload: any) {}
}