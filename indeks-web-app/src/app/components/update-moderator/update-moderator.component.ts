import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { ModeratorService } from '../../services/moderator.service';

@Component({
  selector: 'app-update-moderator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDividerModule
  ],
  templateUrl: './update-moderator.component.html',
  styleUrls: ['./update-moderator.component.css']
})
export class UpdateModeratorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private moderatorService = inject(ModeratorService);
  private snackBar = inject(MatSnackBar);

  moderatorForm: FormGroup = this.fb.group({
    materialPath: [null, [Validators.required]],
  });

  isLoading = true;
  isSubmitting = false;
  moderatorId!: number;
  moderatorName = '';
  
  // Lista godina za padajući meni (kao putanje materijala)
  yearOptions = [1, 2, 3, 4];

  ngOnInit(): void {
    this.moderatorId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadModeratorData();
  }

  loadModeratorData(): void {
    this.isLoading = true;
    this.moderatorService.getModeratorById(this.moderatorId).subscribe({
      next: (data) => {
        // Pretpostavljamo da je materialPath broj (godina)
        // Ako nije broj, postavlja se na 1 kao podrazumevana vrednost
        const yearValue = isNaN(Number(data.materialPath)) ? 1 : Number(data.materialPath);
        
        this.moderatorForm.patchValue({
          materialPath: yearValue
        });
        this.moderatorName = `${data.firstName} ${data.lastName}`;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showErrorMessage('Greška pri učitavanju podataka. Pokušajte ponovo.');
        console.error('Greška pri učitavanju podataka:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.moderatorForm.valid) {
      this.isSubmitting = true;
      
      const updatedModerator = {
        materialPath: this.moderatorForm.value.materialPath // Convert to string if API expects a string
      };
      
      this.moderatorService.updateModerator(this.moderatorId, updatedModerator).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showSuccessMessage('Godina zaduženja uspešno ažurirana');
          this.router.navigate(['/admin/moderators']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.showErrorMessage('Greška pri ažuriranju godine zaduženja. Pokušajte ponovo.');
          console.error('Greška pri ažuriranju:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.moderatorForm);
    }
  }

  // Helper method to show all validation errors
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
  
  // Helper methods for showing notifications
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Zatvori', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
  
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Zatvori', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}