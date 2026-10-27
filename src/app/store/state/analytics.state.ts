import { Action, Selector, State, StateContext } from "@ngxs/store";
import { ANALYTICS_STATE_MODAL } from "../../model/state-modal";
import { AnalyticsService } from "../../services/analytics/analytics.service";
import { Injectable } from "@angular/core";
import { handleDemographics, handleDwell, handleEntryExit, handleFootfall, handleOccupancy } from "../action/analytics.action";
import { catchError, Observable, tap, throwError } from "rxjs";

@State<ANALYTICS_STATE_MODAL>({
    name: 'ANALYTICS',
    defaults: {
        footFall: null,
        dwell: null,
        occupany: null,
        demographics: null,
        entryExit: null
    }
})

@Injectable()
export class AnalyticsState {

    constructor(
        private analyticsService: AnalyticsService
    ) { }

    @Selector()
    static getFootfall(state: ANALYTICS_STATE_MODAL) {
        return state.footFall;
    }
    @Selector()
    static getDwell(state: ANALYTICS_STATE_MODAL) {
        return state.dwell;
    }
    @Selector()
    static getOccupancy(state: ANALYTICS_STATE_MODAL) {
        return state.occupany;
    }
    @Selector()
    static getDemographics(state: ANALYTICS_STATE_MODAL) {
        return state.demographics;
    }
    @Selector()
    static getEntryExit(state: ANALYTICS_STATE_MODAL) {
        return state.entryExit;
    }


    @Action(handleFootfall)
    handleFootfall(
        { patchState }: StateContext<ANALYTICS_STATE_MODAL>,
        { payload }: handleFootfall
    ) {
        return this.analyticsService.getFootFall(payload).pipe(
            tap((response: any) => {
                patchState({
                    footFall: response
                });
            }),
            catchError((error) => {
                console.error('Footfall API error:', error);
                return throwError(() => error);
            })
        );
    }

    @Action(handleDwell)
    handleDwell(
        { patchState }: StateContext<ANALYTICS_STATE_MODAL>,
        { payload }: handleDwell
    ) {
        return this.analyticsService.getDwell(payload).pipe(
            tap((response: any) => {
                patchState({
                    dwell: response
                });
            }),
            catchError((error) => {
                console.error('Footfall API error:', error);
                return throwError(() => error);
            })
        );
    }

    @Action(handleOccupancy)
    handleOccupancy(
        { patchState }: StateContext<ANALYTICS_STATE_MODAL>,
        { payload }: handleOccupancy
    ) {
        return this.analyticsService.getOccupancy(payload).pipe(
            tap((response: any) => {
                patchState({
                    occupany: response
                });
            }),
            catchError((error) => {
                console.error('Footfall API error:', error);
                return throwError(() => error);
            })
        );
    }

    @Action(handleDemographics)
    handleDemographics(
        { patchState }: StateContext<ANALYTICS_STATE_MODAL>,
        { payload }: handleDemographics
    ) {
        return this.analyticsService.getDemographics(payload).pipe(
            tap((response: any) => {
                patchState({
                    demographics: response
                });
            }),
            catchError((error) => {
                console.error('Footfall API error:', error);
                return throwError(() => error);
            })
        );
    }

    @Action(handleEntryExit)
    handleEntryExit(
        { patchState }: StateContext<ANALYTICS_STATE_MODAL>,
        { payload }: handleEntryExit
    ) {
        return this.analyticsService.getEntryExit(payload).pipe(
            tap((response: any) => {
                patchState({
                    entryExit: response
                });
            }),
            catchError((error) => {
                console.error('Footfall API error:', error);
                return throwError(() => error);
            })
        );
    }
}
