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
import { ElementaryGroupService } from '../../services/elementary-group.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-elementary-group',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './add-elementary-group.component.html',
  styleUrl: './add-elementary-group.component.css',
})
export class AddElementaryGroupComponent {
  private elementaryGroupService: ElementaryGroupService = inject(
    ElementaryGroupService
  );

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  public conflict = false;
  public elementaryGroupForm: FormGroup = this.formBuilder.group({
    name: [null, [Validators.required]],
  });

  submitForm(): void {
    if (this.elementaryGroupForm.invalid) {
      return;
    }

    this.elementaryGroupService.add(this.elementaryGroupForm.value).subscribe({
      next: (elementaryGroup: any) => {
        this.navigateBack();
      },
      error: (err: any) => this.handleError(err),
    });
  }

  private navigateBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private handleError(err: any): void {
    this.conflict = true;
    console.error(err.message);
  }
}
