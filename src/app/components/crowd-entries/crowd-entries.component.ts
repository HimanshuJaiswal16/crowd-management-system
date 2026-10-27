import { Component, computed, effect, inject, untracked } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';

import { SiteState } from '../../store/state/site.state';
import { AnalyticsState } from '../../store/state/analytics.state';
import { handleEntryExit } from '../../store/action/analytics.action';

interface EntryExitRecord {
  personId: string;
  personName: string;
  gender: string;
  zoneName: string;
  severity: string;
  entryLocal: string | null;
  exitLocal: string | null;
  dwellMinutes: number | null;
  imageUrl?: string; // optional: shows initials when missing
}

interface EntryExitResponse {
  siteId: string;
  pageSize: number;
  pageNumber: number;
  totalRecords: number;
  totalPages: number;
  records: EntryExitRecord[];
}

@Component({
  selector: 'app-crowd-entries',
  imports: [NgbPaginationModule],
  templateUrl: './crowd-entries.component.html',
  styleUrl: './crowd-entries.component.scss'
})
export class CrowdEntriesComponent {
  private store = inject(Store);

  selectedSite = this.store.selectSignal(SiteState.selectedSite);
  private entryExit = this.store.selectSignal(AnalyticsState.getEntryExit);

  page = 1;
  readonly pageSize = 10;

  // Cast once, then derive what the template needs
  private response = computed(() => this.entryExit() as EntryExitResponse | null);
  records = computed(() => this.response()?.records ?? []);
  totalRecords = computed(() => this.response()?.totalRecords ?? 0);

  constructor() {
    // Reload from page 1 whenever the selected site changes
    effect(() => {
      const site = this.selectedSite();
      if (!site?.siteId) return;

      untracked(() => {
        this.page = 1;
        this.load(String(site.siteId), 1);
      });
    });
  }

  onPageChange(pageNumber: number): void {
    const site = this.selectedSite();
    if (!site?.siteId) return;

    this.page = pageNumber;
    this.load(String(site.siteId), pageNumber);
  }

  // 20 -> "00:20", 75 -> "01:15"
  formatDwell(minutes: number | null): string {
    if (minutes === null) return '--';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  }

  private load(siteId: string, pageNumber: number): void {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    this.store.dispatch(
      new handleEntryExit({
        siteId,
        fromUtc: start.toISOString(),
        toUtc: new Date().toISOString(),
        pageSize: this.pageSize,
        pageNumber
      })
    );
  }
}