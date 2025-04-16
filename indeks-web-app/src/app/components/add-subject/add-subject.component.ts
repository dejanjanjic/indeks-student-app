import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SubjectService } from '../../services/subject.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-subject',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-subject.component.html',
  styleUrl: './add-subject.component.css',
})
export class AddSubjectComponent {
  private subjectService = inject(SubjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  public conflict = false;
  public isLoading = false;
  public subjectForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    year: [null, [Validators.required]],
  });

  submitForm(): void {
    if (this.subjectForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.conflict = false;

    this.subjectService
      .addSubject(this.subjectForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => this.navigateBack(),
        error: (err) => this.handleError(err),
      });
  }

  navigateBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private handleError(err: any): void {
    this.conflict = true;
    console.error(err.message);
  }
}
