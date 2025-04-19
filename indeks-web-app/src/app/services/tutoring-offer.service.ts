import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TutoringOffer } from '../model/tutoring-offer.model';

@Injectable({
  providedIn: 'root',
})
export class TutoringOfferService {
  private apiUrl = 'http://localhost:8080/api/v1/tutoringOffer';
  private reviewUrl = 'http://localhost:8080/api/v1/review';
  constructor(private http: HttpClient) {}

  getTutoringOfferById(id: number): Observable<TutoringOffer> {
    return this.http.get<TutoringOffer>(`${this.apiUrl}/${id}`);
  }

  deleteReviewFromOffer(reviewId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${reviewId}`);
  }
}
