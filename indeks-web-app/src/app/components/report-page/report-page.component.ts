import { Component, OnInit, inject } from '@angular/core';
import { ReportedMaterial } from '../../model/reported-types.model';
import { ReportedAccount } from '../../model/reported-types.model';
import { ReportedComment } from '../../model/reported-types.model';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { MatCard } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { BaseTableComponent } from '../base-table/base-table.component';
import { ReportProblemService } from '../../services/report-problem.service';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-report-page',
  imports: [
    MatCard,
    MatTab,
    MatToolbar,
    MatTabsModule,
    MatTableModule,
    CommonModule,
    BaseTableComponent,
    MatIconModule,
  ],
  templateUrl: './report-page.component.html',
  styleUrl: './report-page.component.css',
})
export class ReportPageComponent implements OnInit {
  constructor(private reportService: ReportProblemService) {}
  retrieveMaterials = (): Observable<ReportedMaterial[]> => {
    return this.reportService.getReportedMaterials() as Observable<
      ReportedMaterial[]
    >;
  };

  retrieveComments = (): Observable<ReportedComment[]> => {
    return this.reportService.getReportedComments() as Observable<
      ReportedComment[]
    >;
  };

  retrieveAccounts = (): Observable<ReportedAccount[]> => {
    return this.reportService.getReportedAccounts() as Observable<
      ReportedAccount[]
    >;
  };
  deleteReportedProblem = (id: number): Observable<any> => {
    return this.reportService.deleteReportedProblem(id);
  };

  ngOnInit(): void {}
}
