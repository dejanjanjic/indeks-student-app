import { Component, inject, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../../services/auth.service';


@Component({
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterOutlet,
    RouterModule,
    MatListModule,
    MatSidenavModule,
    MatIconModule,
  ],
  templateUrl: './moderator-dashboard.component.html',
  styleUrl: './moderator-dashboard.component.css'
})
export class ModeratorDashboardComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  public isOpen = false;
  public logoUrl = 'assets/indeks-logo.png';
  public subjectId = AuthService

  private authService = inject(AuthService);

  public toggle() {
    if (this.sidenav) {
      this.sidenav.toggle();
      this.isOpen = this.sidenav.opened;
    }
  }
}



