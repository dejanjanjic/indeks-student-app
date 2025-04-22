// subject-table.component.ts
import { Component, inject } from '@angular/core';
import { BaseTableComponent } from '../base-table/base-table.component';
import { SubjectService } from '../../services/subject.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-subject-table',
  standalone: true,
  imports: [BaseTableComponent],
  templateUrl: './subject-page.component.html',
  styleUrl: './subject-page.component.css',
})
export class SubjectPageComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  subjectService = inject(SubjectService);

  headerMap = {
    id: 'ID',
    name: 'Naziv predmeta',
    year: 'Godina',
    entityName: 'subject',
  };

  retrieveDataFunction = () => this.subjectService.getAllSubjects();

  addDataFunction = () => {
    this.router.navigate(['add-subject'], { relativeTo: this.route });
  };

  filterDataFunction = (keyword: string) =>
    this.subjectService
      .getAllSubjects()
      .pipe(
        map((subjects) =>
          subjects.filter(
            (s) =>
              s.name.toLowerCase().includes(keyword.toLowerCase()) ||
              s.year.toString().includes(keyword)
          )
        )
      );

  deleteDataFunction = (id: number) => this.subjectService.deleteSubject(id);

  // Add this method
  updateDataFunction = (id: number) => {
    this.router.navigate(['update-subject', id], { relativeTo: this.route });
  };
}
