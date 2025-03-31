import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    HeaderComponent,
    RouterOutlet,
    RouterModule,
    MatListModule,
    MatSidenavModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  public isOpen = true;

  public toggle() {
    this.isOpen = !this.isOpen;
  }
}
