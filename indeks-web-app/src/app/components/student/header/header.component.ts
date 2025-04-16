import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-student-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  private authService = inject(AuthService);
  private router = inject(Router);

  public username: string | null = '';
  public logoUrl = 'assets/indeks-logo.png';

  public isDarkMode = false;
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.loadData();
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
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

  public toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
}
