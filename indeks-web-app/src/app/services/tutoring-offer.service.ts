import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TutoringOffer } from '../model/tutoring-offer.model';
import {TutoringOfferSummary} from '../model/tutoring-offer-summary.model';

@Injectable({
  providedIn: 'root',
})
export class TutoringOfferService {
  private apiUrl = 'http://localhost:8080/api/v1/tutoringOffer';
  private reviewUrl = 'http://localhost:8080/api/v1/review';

  constructor(private http: HttpClient) {}

  // Get summary list
  getTutoringOfferDetails(): Observable<TutoringOfferSummary[]> {
    return this.http.get<TutoringOfferSummary[]>(`${this.apiUrl}/details`);
  }

  // Other methods remain the same
  getTutoringOfferById(id: number): Observable<TutoringOffer> {
    return this.http.get<TutoringOffer>(`${this.apiUrl}/${id}`);
  }

  deleteTutoringOffer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Fix potential bug in this method (should probably use reviewUrl)
  deleteReviewFromOffer(reviewId: number): Observable<any> {
    return this.http.delete(`${this.reviewUrl}/${reviewId}`);
  }
}
