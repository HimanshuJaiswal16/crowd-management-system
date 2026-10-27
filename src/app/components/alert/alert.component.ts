import { Component, effect, inject, untracked } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { SiteState } from '../../store/state/site.state';
import { handleSelectedSiteDetails } from '../../store/action/site.action';

interface Alert {
  id: number;
  date: string;
  time: string;
  message: string;
  zone: string;
  severity: 'High' | 'Medium' | 'Low';
  isNew?: boolean;
}

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  private store = inject(Store);
  private activeOffcanvas = inject(NgbActiveOffcanvas);

  selectedSite = this.store.selectSignal(SiteState.selectedSite);
  selectedSiteDetails = this.store.selectSignal(SiteState.selectedSiteDetails);

  constructor() {
    effect(() => {
      const site = this.selectedSite();
      if (!site?.siteId) return;

      untracked(() => this.store.dispatch(new handleSelectedSiteDetails({ siteId: site.siteId })));
    });
  }

  close(): void {
    this.activeOffcanvas.dismiss();
  }

  // TODO: replace with alerts from the API
  alerts: Alert[] = [
    { id: 1, date: 'March 03 2025', time: '',      message: 'Ahmad Entered',  zone: 'Zone A', severity: 'High',   isNew: true },
    { id: 2, date: 'March 03 2025', time: '10:12', message: 'Mathew Entered', zone: 'Zone A', severity: 'Medium' },
    { id: 3, date: 'March 03 2025', time: '10:12', message: 'Rony Entered',   zone: 'Zone b', severity: 'High' },
    { id: 4, date: 'March 03 2025', time: '10:12', message: 'Rony Entered',   zone: 'Zone b', severity: 'Low' },
    { id: 5, date: 'March 03 2025', time: '10:12', message: 'Rony Entered',   zone: 'Zone b', severity: 'Low' },
    { id: 6, date: 'March 03 2025', time: '10:12', message: 'Rony Entered',   zone: 'Zone b', severity: 'High' },
    { id: 7, date: 'March 03 2025', time: '10:12', message: 'Rony Entered',   zone: 'Zone b', severity: 'High' }
  ];
}