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
    MatSnackBarModule
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
    materialPath: ['', Validators.required]
  });

  isLoading = true;
  isSubmitting = false;
  moderatorId!: number;
  moderatorName = '';

  ngOnInit(): void {
    this.moderatorId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadModeratorData();
  }

  loadModeratorData(): void {
    this.isLoading = true;
    this.moderatorService.getModeratorById(this.moderatorId).subscribe({
      next: (data) => {
        this.moderatorForm.patchValue({
          materialPath: data.materialPath
        });
        this.moderatorName = `${data.firstName} ${data.lastName}`;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Greška pri učitavanju podataka. Pokušajte ponovo.', 'Zatvori', {
          duration: 3000
        });
        console.error('Greška pri učitavanju podataka:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.moderatorForm.valid) {
      this.isSubmitting = true;
      
      const updatedModerator = {
        materialPath: this.moderatorForm.value.materialPath
      };
      
      this.moderatorService.updateModerator(this.moderatorId, updatedModerator).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.snackBar.open('Putanja materijala uspešno ažurirana', 'Zatvori', {
            duration: 3000
          });
          this.router.navigate(['/admin/moderators']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Greška pri ažuriranju putanje materijala. Pokušajte ponovo.', 'Zatvori', {
            duration: 3000
          });
          console.error('Greška pri ažuriranju:', error);
        }
      });
    }
  }
}