import { Routes } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { SchedulePageComponent } from './components/schedule-page/schedule-page.component';
import { ElementaryGroupTableComponent } from './components/elementary-group-table/elementary-group-table.component';
import { AddElementayGroupComponent } from './components/add-elementay-group/add-elementay-group.component';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: 'login', canActivate: [loginGuard], component: LoginFormComponent },
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
      { path: 'elementary-groups', component: ElementaryGroupTableComponent },
      {
        path: 'elementary-groups/add-elementary-group',
        component: AddElementayGroupComponent,
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
