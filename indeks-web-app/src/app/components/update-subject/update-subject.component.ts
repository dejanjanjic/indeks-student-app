import { Component, inject, OnInit } from '@angular/core';
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
import { Subject } from '../../model/subject.model';
import { finalize, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-update-subject',
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
  templateUrl: './update-subject.component.html',
  styleUrl: './update-subject.component.css',
})
export class UpdateSubjectComponent implements OnInit {
  private subjectService = inject(SubjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  public conflict = false;
  public isLoading = false;
  public subjectForm!: FormGroup;
  private subjectId!: number;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.subjectId = Number(params.get('id'));
          return this.subjectService.getSubjectById(this.subjectId);
        })
      )
      .subscribe({
        next: (subject) => this.initializeForm(subject),
        error: (err) => console.error(err),
      });
  }

  private initializeForm(subject: Subject): void {
    this.subjectForm = this.formBuilder.group({
      name: [subject.name, [Validators.required]],
      year: [subject.year, [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.subjectForm.invalid) return;

    this.isLoading = true;
    this.conflict = false;

    const updatedSubject: Subject = {
      id: this.subjectId,
      ...this.subjectForm.value,
    };

    this.subjectService
      .updateSubject(updatedSubject)
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
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  private handleError(err: any): void {
    this.conflict = true;
    console.error(err);
  }
}
