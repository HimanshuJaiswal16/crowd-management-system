import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { routes } from '../../../app.routes';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-siderbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './siderbar.component.html',
  styleUrl: './siderbar.component.scss'
})
export class SiderbarComponent {
  // Label + icon come from each route's `data` (see app.routes snippet below)
  navItems: NavItem[] = (routes[2].children ?? [])
    .filter(r => r.path && r.path !== '')
    .map(r => ({
      path: r.path!,
      label: r.data?.['label'] ?? r.path!,
      icon: r.data?.['icon'] ?? 'circle'
    }));

  logout(): void {
    // TODO: clear token / call auth service, then navigate to login
  }
}