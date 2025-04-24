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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

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
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './add-moderator.component.html',
  styleUrl: './add-moderator.component.css'
})
export class AddModeratorComponent implements OnInit {
  moderatorForm!: FormGroup;
  hidePassword = true;
  isLoading = false; // Added isLoading property for spinner
  
  constructor(
    private fb: FormBuilder,
    public moderatorService: ModeratorService,
    private snackBar: MatSnackBar,
    private router: Router // Added router for navigation
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
      materialPath: [1] // Default to 1 instead of 0
    });
  }

  onSubmit(): void {
    if (this.moderatorForm.valid) {
      this.isLoading = true; // Start loading
      
      const materialPathValue = this.moderatorForm.get('materialPath')?.value;
      
      const moderatorDto: AddModeratorDTO = {
        firstName: this.moderatorForm.get('firstName')?.value,
        lastName: this.moderatorForm.get('lastName')?.value,
        email: this.moderatorForm.get('email')?.value,
        password: this.moderatorForm.get('password')?.value,
        materialPath: Number(materialPathValue) // Ensure explicit conversion to number
      };
      
      console.log('Sending moderator data:', moderatorDto); // Add this to debug
      
      this.moderatorService.addModerator(moderatorDto)
        .subscribe({
          next: (response) => {
            this.isLoading = false; // Stop loading
            this.snackBar.open('Moderator account created successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
            this.moderatorForm.reset();
            this.router.navigate(['/moderators']); // Navigate to moderators page after success
            // Reset materialPath to default value after form reset
            this.moderatorForm.patchValue({
              materialPath: 1
            });
          },
          error: (error) => {
            console.error('Error creating moderator:', error);
            // Display more detailed error info if available
            const errorMessage = error.error?.message || 'Error creating moderator account. Please try again.';
            this.snackBar.open(errorMessage, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
            this.isLoading = false; // Stop loading on error
          }
        });
    } else {
      this.markFormGroupTouched(this.moderatorForm);
    }
  }

  // Method to navigate back (similar to add-elementary-group)
  navigateBack(): void {
    this.router.navigate(['/moderators']); // Adjust the route as needed
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