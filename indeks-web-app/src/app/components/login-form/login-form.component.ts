import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service'; // prilagodi putanju ako treba

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  standalone: true,
})
export class LoginFormComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private accountService = inject(AccountService);
  private router = inject(Router);

  public isLoading = false;
  public errorMessage = '';
  public hidePassword = true;
  public logoUrl = 'assets/indeks-logo.png';

  public loginForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]],
  });

  onSubmit(): void {
    this.login();
  }

  login() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(loginData).subscribe({
      next: () => {
        this.isLoading = false;
        const email = loginData.email;
        this.accountService.getAccountRoleByEmail(email).subscribe({
          next: (role: string) => {
            this.isLoading = false;
            if (role === 'MODERATOR') {
              const userId = this.authService.getUserId();

              if (userId) {
                this.router.navigate(['/moderator-materials-page', userId]);
              }
            }
          },
          error: (err) => {
            console.error('Greška pri dohvatu uloge:', err);
            this.router.navigate(['/home']);
          },
        });

        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Neispravni kredencijali ili greška pri prijavi';
        console.error(error);
      },
    });
  }
}
