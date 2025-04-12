export interface ReportedMaterial {
  id: number;
  materialName: string;
  reason: string;
  reporterName: string;
  reporterSurname: string;
  date: Date;
}

export interface ReportedComment {
  id: number;
  reviewText: string;
  reason: string;
  reporterName: string;
  reporterSurname: string;
  date: Date;
}

export interface ReportedAccount {
  id: number;
  reporterName: string;
  reporterSurname: string;
  reportedName: string;
  reporterSurename: string;
  reason: string;
  date: Date;
}
