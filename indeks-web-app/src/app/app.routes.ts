import { Routes } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { MaterialPageComponent } from './components/material-page/material-page.component';
import { StudentProfileComponent } from './components/student/student-profile/student-profile.component';
import { SchedulePageComponent } from './components/schedule-page/schedule-page.component';
import { ElementaryGroupTableComponent } from './components/elementary-group-table/elementary-group-table.component';
import { AddElementaryGroupComponent } from './components/add-elementary-group/add-elementary-group.component';
import { loginGuard } from './guards/login.guard';
import { SubjectPageComponent } from './components/subject-page/subject-page.component';
import { AddSubjectComponent } from './components/add-subject/add-subject.component';
import { UpdateSubjectComponent } from './components/update-subject/update-subject.component';
import { AdminMaterialPageComponent } from './components/admin-material-page/admin-material-page.component';
import { ModeratorTableComponent } from './components/moderator-table/moderator-table.component';
import { AddModeratorComponent } from './components/add-moderator/add-moderator.component';
import { UpdateModeratorComponent } from './components/update-moderator/update-moderator.component';

export const routes: Routes = [
  { path: 'login', canActivate: [loginGuard], component: LoginFormComponent },
  {
    path: 'admin',
    loadComponent: () =>
      import(
        './components/admin/admin-dashboard/admin-dashboard.component'
      ).then((m) => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },

    children: [
      { path: 'elementary-groups', component: ElementaryGroupTableComponent },
      { path: 'subject-page', component: SubjectPageComponent },
      { path: 'materials-page', component: AdminMaterialPageComponent },
      {
        path: 'elementary-groups/add-elementary-group',
        component: AddElementaryGroupComponent,
      },
      {
        path: 'subject-page/add-subject',
        component: AddSubjectComponent,
      },
      {
        path: 'subject-page/update-subject/:id',
        component: UpdateSubjectComponent,
      },
      {
        path: 'report-page',
        component: ReportPageComponent,
      },
      { path: '', redirectTo: 'elementary-groups', pathMatch: 'full' },
      { path: 'moderators', component: ModeratorTableComponent },
      { path: 'moderators/add-moderator', component: AddModeratorComponent },
      {
        path: 'moderators/update-moderator/:id',
        component: UpdateModeratorComponent,
      },
      {
        path: 'users-table',
        loadComponent: () =>
          import('./components/users-table/users-table.component').then(
            (m) => m.UsersTableComponent
          ),
      },
    ],
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT'] },
    children: [
      {
        path: 'profile',
        component: StudentProfileComponent,
        children: [
          { path: 'material-page', component: MaterialPageComponent },
          { path: 'schedule-page', component: SchedulePageComponent },
          { path: '', redirectTo: 'material-page', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
