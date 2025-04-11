import { Component, inject, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-admin-dashboard',
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
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  public isOpen = false;
  public logoUrl = 'assets/indeks-logo.png';

  private authService = inject(AuthService);

  public toggle() {
    if (this.sidenav) {
      this.sidenav.toggle();
      this.isOpen = this.sidenav.opened;
    }
  }
}
