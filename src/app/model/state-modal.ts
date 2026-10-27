import { Site } from "./site.model";

export interface SITE_STATE_MODAL {
    siteList: Site[];
    selectedSite: Site | null;
    selectedSiteDetails: any | null;
}

export interface ANALYTICS_STATE_MODAL {
    footFall: any;
    dwell: any;
    occupany: any;
    demographics: any;
    entryExit: any;
}

export interface SIMULATION_STATE_MODAL {
    start: boolean;
    stop: boolean;
}