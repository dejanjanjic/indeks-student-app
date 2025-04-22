// review.component.ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from '../../services/review.service';
import { BaseTableComponent } from '../base-table/base-table.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-review-table',
  standalone: true,
  imports: [BaseTableComponent],
  template: `
    <app-base-table
      [displayedColumns]="['id', 'reviewerName', 'description', 'grade', 'actions']"
      [service]="reviewService"
      [headerMap]="headerMap"
      [actionButtons]="['delete']"
      [retrieveDataFunction]="retrieveDataFunction"
      [deleteDataFunction]="deleteDataFunction"
    />
  `,
})
export class ReviewComponent {
  private route = inject(ActivatedRoute);
  reviewService = inject(ReviewService);
  tutoringOfferId = this.route.snapshot.paramMap.get('id');

  headerMap = {
    id: 'ID',
    reviewerName: 'Recenzent',
    description: 'Opis',
    grade: 'Ocena',
    entityName: 'review'
  };

  retrieveDataFunction = () => this.reviewService.getReviewsByTutoringOfferId(parseInt(this.tutoringOfferId!));

  deleteDataFunction = (id: number) =>
    this.reviewService.deleteReview(parseInt(this.tutoringOfferId!), id);
}
