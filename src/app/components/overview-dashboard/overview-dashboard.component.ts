import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { Store } from '@ngxs/store';
import { Chart, registerables } from 'chart.js';
import { asyncScheduler, finalize, throttleTime } from 'rxjs';
import { SiteState } from '../../store/state/site.state';
import { handleDemographics, handleDwell, handleFootfall, handleOccupancy } from '../../store/action/analytics.action';
import { AnalyticsState } from '../../store/state/analytics.state';
import { LiveUpdateService } from '../../services/live-update/live-update.service';
// import { LiveUpdatesService } from '../../services/live-updates/live-updates.service';

Chart.register(...registerables);

interface FootfallResponse {
  siteId: string;
  footfall: number;
}

interface DwellResponse {
  siteId: string;
  avgDwellMinutes: number;
  dwellRecords: number;
}

interface OccupancyBucket {
  startLocal: string;
  occupancy: number;
}

interface OccupancyResponse {
  siteId: string;
  timezone: string;
  buckets: OccupancyBucket[];
}

interface Stat {
  label: string;
  value: string;
}

const COLORS = { occupancy: '#0a7c78', male: '#0a7c78', female: '#f2a93b' };

// Never refresh more often than this, even if the server sends faster
const MIN_REFRESH_MS = 2000;

@Component({
  selector: 'app-overview-dashboard',
  imports: [],
  templateUrl: './overview-dashboard.component.html',
  styleUrl: './overview-dashboard.component.scss'
})
export class OverviewDashboardComponent implements AfterViewInit {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private liveUpdates = inject(LiveUpdateService);

  // ---- Store data ----
  selectedSite = this.store.selectSignal(SiteState.selectedSite);
  private footfallState = this.store.selectSignal(AnalyticsState.getFootfall);
  private dwellState = this.store.selectSignal(AnalyticsState.getDwell);
  private occupancyState = this.store.selectSignal(AnalyticsState.getOccupancy);
  private demographicsState = this.store.selectSignal(AnalyticsState.getDemographics);

  private footfall = computed(() => this.footfallState() as FootfallResponse | null);
  private dwell = computed(() => this.dwellState() as DwellResponse | null);
  private occupancy = computed(() => this.occupancyState() as OccupancyResponse | null);
  private demographics = computed(() => this.demographicsState());

  // true only for the first load of a site, NOT for live refreshes (avoids flicker)
  readonly loading = signal(false);

  statGroups = computed<Stat[][]>(() => {
    const buckets = this.occupancy()?.buckets ?? [];
    const liveOccupancy = buckets.length ? buckets[buckets.length - 1].occupancy : null;

    return [
      [
        { label: 'Live Occupancy', value: this.formatNumber(liveOccupancy) },
        { label: "Today's Footfall", value: this.formatNumber(this.footfall()?.footfall) }
      ],
      [
        { label: 'Avg Dwell Time', value: this.formatDwell(this.dwell()?.avgDwellMinutes) }
      ]
    ];
  });

  private occupancySeries = computed(() => {
    const buckets = this.occupancy()?.buckets ?? [];
    return {
      labels: buckets.map(b => this.timeLabel(b.startLocal)),
      values: buckets.map(b => b.occupancy)
    };
  });

  // Demographics (sample values until the charts are wired to this.demographics())
  readonly malePercent = 55;
  readonly femalePercent = 45;

  // ---- Charts ----
  private occupancyCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('occupancyCanvas');
  private donutCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('donutCanvas');
  private demographicsCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('demographicsCanvas');

  private occupancyChart?: Chart;
  private charts: Chart[] = [];
  private viewReady = signal(false);

  constructor() {
    // 1) When the site changes: load once (with spinner), then listen for live updates
    effect((onCleanup) => {
      const site = this.selectedSite();
      if (!site?.siteId) return;

      const siteId = String(site.siteId);

      untracked(() => {
        this.refresh(siteId, true);

        const subscription = this.liveUpdates
          .connect(siteId)
          .pipe(throttleTime(MIN_REFRESH_MS, asyncScheduler, { leading: true, trailing: true }))
          .subscribe(() => this.refresh(siteId, false));

        // Runs when the site changes again or the page is left: closes the old socket
        onCleanup(() => subscription.unsubscribe());
      });
    });

    // 2) Push new occupancy data into the chart (Chart.js doesn't watch signals)
    effect(() => {
      const { labels, values } = this.occupancySeries();
      if (!this.viewReady() || !this.occupancyChart) return;

      this.occupancyChart.data.labels = labels;
      this.occupancyChart.data.datasets[0].data = values;
      this.occupancyChart.update('none'); // no animation, so updates every few seconds don't "replay"
    });

    this.destroyRef.onDestroy(() => this.charts.forEach(c => c.destroy()));
  }

  ngAfterViewInit(): void {
    this.occupancyChart = this.createOccupancyChart();
    this.createDonutChart();
    this.createDemographicsChart();
    this.viewReady.set(true);
  }

  // ---- Data loading ----

  // showLoading = true for the first load, false for silent live refreshes
  private refresh(siteId: string, showLoading: boolean): void {
    const payload = { siteId, ...this.todayRange() }; // fresh "now" on every refresh

    if (showLoading) this.loading.set(true);

    this.store
      .dispatch([
        new handleFootfall(payload),
        new handleDwell(payload),
        new handleOccupancy(payload),
        new handleDemographics(payload)
      ])
      .pipe(finalize(() => { if (showLoading) this.loading.set(false); }))
      .subscribe({ error: () => { /* the state already logs API errors */ } });
  }

  // ---- Helpers ----
  private todayRange() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return { fromUtc: start.toISOString(), toUtc: new Date().toISOString() };
  }

  private formatNumber(value: number | null | undefined): string {
    return value === null || value === undefined ? '—' : value.toLocaleString();
  }

  private formatDwell(minutes: number | null | undefined): string {
    if (minutes === null || minutes === undefined) return '—';
    const m = Math.floor(minutes);
    const s = Math.round((minutes - m) * 60);
    return `${String(m).padStart(2, '0')}min ${String(s).padStart(2, '0')}sec`;
  }

  private timeLabel(value: string): string {
    const date = new Date(value);
    return isNaN(date.getTime())
      ? value
      : date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  private baseOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: '#eef1f2' } }
      }
    } as const;
  }

  private createOccupancyChart(): Chart {
    const chart = new Chart(this.occupancyCanvas().nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          data: [],
          borderColor: COLORS.occupancy,
          backgroundColor: 'rgba(10, 124, 120, 0.12)',
          fill: true,
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: this.baseOptions()
    });
    this.charts.push(chart);
    return chart;
  }

  private createDonutChart(): void {
    this.charts.push(new Chart(this.donutCanvas().nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{
          data: [this.malePercent, this.femalePercent],
          backgroundColor: [COLORS.male, COLORS.female],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: { legend: { display: false } }
      }
    }));
  }

  private createDemographicsChart(): void {
    const labels = ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
    const line = (data: number[], color: string) => ({ data, borderColor: color, tension: 0.4, pointRadius: 0 });

    this.charts.push(new Chart(this.demographicsCanvas().nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          line([10, 8, 22, 90, 170, 220, 150, 50], COLORS.male),
          line([8, 6, 18, 80, 140, 190, 130, 40], COLORS.female)
        ]
      },
      options: this.baseOptions()
    }));
  }
}