import { Action, Selector, State, StateContext } from "@ngxs/store";
import { SITE_STATE_MODAL } from "../../model/state-modal";
import { Injectable } from "@angular/core";
import { SitesService } from "../../services/sites/sites.service";
import { catchError, Observable, tap, throwError } from "rxjs";
import { handleSelectedSite, handleSelectedSiteDetails, handleSiteList } from "../action/site.action";

@State<SITE_STATE_MODAL>({
    name: 'SITE',
    defaults: {
        siteList: [],
        selectedSite: null,
        selectedSiteDetails: null
    },
})

@Injectable()
export class SiteState {

    constructor(
        private siteService: SitesService
    ) { }

    @Selector()
    static selectedSite(state: SITE_STATE_MODAL) {
        return state.selectedSite;
    }
    @Selector()
    static siteList(state: SITE_STATE_MODAL) {
        return state.siteList;
    }
    @Selector()
    static selectedSiteDetails(state: SITE_STATE_MODAL) {
        return state.selectedSiteDetails;
    }

    @Action(handleSiteList)
    handleSiteList(
        { getState, setState, patchState }: StateContext<SITE_STATE_MODAL>,
        { }
    ) {
        return new Observable((observer) => {
            this.siteService.getAllSites().subscribe({
                next: (response: any) => {
                    const state = getState();
                    if (response.length > 0) {

                        setState({
                            ...state,
                            siteList: response,
                        });
                        patchState({
                            selectedSite: response.length > 0 ? response[0] : null
                        });

                        observer.next(response);
                    } else {
                        setState({
                            ...state,
                            siteList: []
                        });
                        observer.error(response);
                    }
                    observer.complete();
                },
                error: (err: any) => {
                    observer.error(err);
                },
                complete: () => {
                    // console.log('complete');
                },
            });
        });
    };

    @Action(handleSelectedSite)
    handleSelectedSite(
        { patchState }: StateContext<SITE_STATE_MODAL>,
        { payload }: handleSelectedSite
    ) {
        patchState({
            selectedSite: payload
        });
    }

    @Action(handleSelectedSiteDetails)
    handleSelectedSiteDetails(
        { patchState }: StateContext<SITE_STATE_MODAL>,
        { payload }: handleSelectedSiteDetails
    ) {
        return this.siteService.getSelectSiteBySiteId(payload).pipe(
            tap((response: any) => {
                patchState({
                    selectedSiteDetails: response
                });

                console.log('Updated site details:', response);
            }),
            catchError(error => {
                console.error('Failed to load site details:', error);
                return throwError(() => error);
            })
        );
    }
}

