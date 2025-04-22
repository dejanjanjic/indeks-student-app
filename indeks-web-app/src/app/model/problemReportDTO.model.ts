export interface ProblemReportDTO {
    id?: number;
    reason: string;
    time?: string; 
    type?: number;
    reviewId?: number;
    materialId?: number;
    reporterId?: number;
    reportedId?: number;
  }