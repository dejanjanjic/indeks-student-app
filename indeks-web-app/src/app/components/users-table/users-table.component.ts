import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAccountService } from '../../services/user-account.service';
import { BaseTableComponent } from '../base-table/base-table.component';

@Component({
  selector: 'app-users-table',
  imports: [BaseTableComponent],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css',
})
export class UsersTableComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userAccountService: UserAccountService = inject(UserAccountService);
  headerMap = {
    id: 'Id',
    firstName: 'Ime',
    lastName: 'Prezime',
    email: 'Mejl',
    role: 'Tip naloga',
    active: 'Aktivan/Suspendovan',
  };

  retrieveDataFunction = () => this.userAccountService.getUserAccountsDetails();

  filterDataFunction = (keyword: string) =>
    this.userAccountService.getByKeyword(keyword);
}
