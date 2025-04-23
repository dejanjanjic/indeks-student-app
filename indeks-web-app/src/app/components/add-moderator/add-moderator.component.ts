import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AddModeratorDTO, ModeratorService } from '../../services/moderator.service';

@Component({
  selector: 'app-add-moderator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './add-moderator.component.html',
  styleUrl: './add-moderator.component.css'
})
export class AddModeratorComponent implements OnInit {
  moderatorForm!: FormGroup;
  hidePassword = true;
  
  constructor(
    private fb: FormBuilder,
    public moderatorService: ModeratorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.moderatorForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      materialPath: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.moderatorForm.valid) {
      const moderatorDto: AddModeratorDTO = {
        firstName: this.moderatorForm.get('firstName')?.value,
        lastName: this.moderatorForm.get('lastName')?.value,
        email: this.moderatorForm.get('email')?.value,
        password: this.moderatorForm.get('password')?.value,
        materialPath: Number(this.moderatorForm.get('materialPath')?.value)
      };
      
      this.moderatorService.addModerator(moderatorDto)
        .subscribe({
          next: (response) => {
            this.snackBar.open('Moderator account created successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
            this.moderatorForm.reset();
          },
          error: (error) => {
            this.snackBar.open('Error creating moderator account. Please try again.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
            console.error('Error creating moderator:', error);
          }
        });
    } else {
      this.markFormGroupTouched(this.moderatorForm);
    }
  }

  // Helper method to mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}