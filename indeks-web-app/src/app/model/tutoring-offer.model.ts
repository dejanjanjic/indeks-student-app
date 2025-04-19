import { Review } from './review.model';
export interface TutoringOffer {
  id: number;
  description: String;
  reviews: Review[];
}
