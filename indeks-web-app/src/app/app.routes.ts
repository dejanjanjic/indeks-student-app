import { Routes } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { SchedulePageComponent } from './components/schedule-page/schedule-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT'] },
    children: [
      { path: 'profile', component: StudentProfileComponent },
      { path: 'schedule', component: SchedulePageComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
