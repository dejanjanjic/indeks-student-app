import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  private authService = inject(AuthService);
  private router = inject(Router);

  public username: string | null = '';

  ngOnInit(): void {
    this.loadData();
  }
  public loadData() {
    this.username = this.authService.getUsername();
  }
  public logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  public onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
