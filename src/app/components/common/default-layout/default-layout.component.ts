import { Component, inject, OnInit } from '@angular/core';
import { SiderbarComponent } from '../siderbar/siderbar.component';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-default-layout',
  imports: [
    SiderbarComponent,
    HeaderComponent,
    RouterOutlet
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent{

}
