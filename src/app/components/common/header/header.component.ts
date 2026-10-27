import { Component, OnInit, inject } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { AlertComponent } from '../../alert/alert.component';
import { SiteState } from '../../../store/state/site.state';
import { handleSelectedSite, handleSiteList } from '../../../store/action/site.action';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private offcanvasService = inject(NgbOffcanvas);
  private store = inject(Store);

  sites = this.store.selectSignal(SiteState.siteList);
  selectedSite = this.store.selectSignal(SiteState.selectedSite);

  ngOnInit(): void {
    if (this.sites().length === 0) {
      this.store.dispatch(new handleSiteList());
    }
  }

  onSiteChange(event: Event): void {
    const siteId = (event.target as HTMLSelectElement).value;
    const site = this.sites().find(item => String(item.siteId) === siteId);

    if (site) {
      this.store.dispatch(new handleSelectedSite(site));
    }
  }

  openSidebar(): void {
    this.offcanvasService.open(AlertComponent, {
      position: 'end',
      backdrop: true,
      scroll: false
    });
  }
}