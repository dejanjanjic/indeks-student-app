import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Add this interface to your models
export interface ReviewReal {
  id: number;
  reviewerName: string;
  description: string;
  grade: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:8080/api/v1/tutoringOffer';

  constructor(private http: HttpClient) { }

  getReviewsByTutoringOfferId(tutoringOfferId: number): Observable<ReviewReal[]> {
    return this.http.get<{ reviews: ReviewReal[] }>(
      `${this.apiUrl}/${tutoringOfferId}/with-reviews`
    ).pipe(
      map(response => response.reviews)
    );
  }

  deleteReview(tutoringOfferId: number, reviewId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${tutoringOfferId}/reviews/${reviewId}`
    );
  }
}
