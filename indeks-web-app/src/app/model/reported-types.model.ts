export interface ReportedMaterial {
  id: number;
  materialName: string;
  materialId: number;
  reason: string;
  reporterName: string;
  reporterSurname: string;
  time: Date;
}

export interface ReportedComment {
  id: number;
  reviewText: string;
  reason: string;
  reporterName: string;
  reporterSurname: string;
  time: Date;
  reviewId: number;
}

export interface ReportedAccount {
  id: number;
  reporterName: string;
  reporterSurname: string;
  reportedName: string;
  reporterSurename: string;
  reportedId: number;
  reason: string;
  time: Date;
}
