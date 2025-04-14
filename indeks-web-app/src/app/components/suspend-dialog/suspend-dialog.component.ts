import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UserAccountService } from '../../services/user-account.service';
import { User } from '../../model/user-account.model';
import { ReportedAccount } from '../../model/reported-types.model';
import { MatDivider } from '@angular/material/divider';

export interface DialogData {
  user: User; // Korisnik koga suspendujemo
  reportedAccount: ReportedAccount; // Celi prijavljeni nalog
}

@Component({
  selector: 'app-suspend-dialog',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatIconModule,
    MatDivider,
  ],
  templateUrl: './suspend-dialog.component.html',
  styleUrl: './suspend-dialog.component.css',
})
export class SuspendDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SuspendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserAccountService
  ) {}

  suspendUser(userId: number): void {
    this.userService.updateSuspension(userId).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
