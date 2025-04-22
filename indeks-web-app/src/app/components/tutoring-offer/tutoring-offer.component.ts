// tutoring-offer.component.ts
import { Component, inject } from '@angular/core';
import { BaseTableComponent } from '../base-table/base-table.component';
import { TutoringOfferService } from '../../services/tutoring-offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tutoring-offer-table',
  standalone: true,
  imports: [BaseTableComponent],
  template: `
    <app-base-table
      [displayedColumns]="['tutoringOfferId', 'instructorName', 'subjectName', 'averageRating', 'actions']"
      [service]="tutoringOfferService"
      [headerMap]="headerMap"
      [actionButtons]="['delete', 'details']"
      [retrieveDataFunction]="retrieveDataFunction"
      [viewDetailsFunction]="viewDetailsFunction"
      [filterDataFunction]="filterDataFunction"
      [deleteDataFunction]="deleteDataFunction"
    />
  `,
})
export class TutoringOfferPageComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  tutoringOfferService = inject(TutoringOfferService);

  headerMap = {
    tutoringOfferId: 'ID',
    instructorName: 'Instruktor',
    subjectName: 'Predmet',
    averageRating: 'Prosječna ocena',
    entityName: 'tutoringOffer',
  };


  viewDetailsFunction = (id: number) => {
    console.log('View details called with ID:', id);

    // If your data is already loaded in the table, you could look up
    // the actual tutoringOfferId by the index. But a more direct approach
    // would be to modify the BaseTableComponent.

    if (id !== undefined && id !== null) {
      this.router.navigate([id.toString()], {
        relativeTo: this.route,
      });
    } else {
      console.error('Cannot navigate to undefined ID'+id);
    }
  };
  retrieveDataFunction = () => this.tutoringOfferService.getTutoringOfferDetails();

  filterDataFunction = (keyword: string) =>
    this.tutoringOfferService.getTutoringOfferDetails().pipe(
      map(offers => offers.filter(offer =>
          offer.instructorName.toLowerCase().includes(keyword.toLowerCase()) ||
          offer.subjectName.toLowerCase().includes(keyword.toLowerCase()) ||
          offer.tutoringOfferId.toString().includes(keyword) ||
          offer.averageRating.toString().includes(keyword)
        )
      ))

  deleteDataFunction = (id: number) =>
    this.tutoringOfferService.deleteTutoringOffer(id);
}
