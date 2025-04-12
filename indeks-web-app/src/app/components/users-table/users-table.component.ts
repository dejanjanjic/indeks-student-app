import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAccountService } from '../../services/user-account.service';
import { BaseTableComponent } from '../base-table/base-table.component';

@Component({
  selector: 'app-users-table',
  imports: [BaseTableComponent],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css',
  standalone: true,
})
export class UsersTableComponent {
  @ViewChild(BaseTableComponent) baseTableComponent!: BaseTableComponent<any>;

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

  handleToggleChange(event: { id: number; column: string; value: boolean }) {
    this.baseTableComponent.isLoading = true;
    this.userAccountService.updateSuspension(event.id).subscribe({
      next: () => {
        console.log(`Status korisnika ${event.id} uspešno promenjen.`);
        this.baseTableComponent.loadData();
      },
      error: (err) => {
        console.error('Greška pri ažuriranju statusa suspenzije:', err);
        const itemIndex = this.baseTableComponent.dataSource.data.findIndex(
          (item) => item.id === event.id
        );
        if (itemIndex > -1) {
          const currentItem =
            this.baseTableComponent.dataSource.data[itemIndex];
          currentItem[event.column] = !event.value;

          this.baseTableComponent.dataSource.data = [
            ...this.baseTableComponent.dataSource.data,
          ];
        }
        this.baseTableComponent.isLoading = false;
      },
    });
  }
}
