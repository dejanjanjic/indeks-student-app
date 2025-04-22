import { Component, OnInit } from '@angular/core';
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
import { MaterialService } from '../../services/material.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { UserAccountService } from '../../services/user-account.service';
import { SuspendDialogComponent } from '../suspend-dialog/suspend-dialog.component';
import { TutoringOfferService } from '../../services/tutoring-offer.service';

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
  constructor(
    private reportService: ReportProblemService,
    private materialService: MaterialService,
    private userService: UserAccountService,
    public dialog: MatDialog,
    public tutoringOfferService: TutoringOfferService
  ) {}

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

  deleteReportedMaterial = (reportedMaterialId: number): void => {
    this.reportService.getReportedMaterials().subscribe((reportedMaterials) => {
      const reportedMaterial = reportedMaterials.find(
        (m) => m.id === reportedMaterialId
      );
      if (reportedMaterial) {
        const materialId = reportedMaterial.materialId;
        console.log('NADAJMO SE MATERIAL ID:', reportedMaterialId);
        this.materialService
          .getMaterialById(materialId)
          .subscribe((material) => {
            if (material) {
              const dialogRef = this.dialog.open(DeleteDialogComponent, {
                width: '400px',
                data: { name: material.name },
              });

              dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                  this.materialService
                    .deleteMaterial(materialId)
                    .subscribe(() => {
                      this.reportService
                        .deleteReportedProblem(reportedMaterialId)
                        .subscribe(() => {
                          this.retrieveMaterials();
                        });
                    });
                }
              });
            } else {
              console.error(
                'Materijal sa ID-om ' + materialId + ' nije pronađen.'
              );
            }
          });
      } else {
        console.error(
          'Prijavljeni materijal sa ID-om ' +
            reportedMaterialId +
            ' nije pronađen.'
        );
      }
    });
  };

  suspendReportedUser = (reportedUserId: number): void => {
    this.reportService.getReportedAccounts().subscribe((reportedAccounts) => {
      const reportedAccount = reportedAccounts.find(
        (a) => a.id === reportedUserId
      );
      if (reportedAccount) {
        const userId = reportedAccount.reportedId;

        this.userService.getUserById(userId).subscribe((user) => {
          if (user) {
            const dialogRef = this.dialog.open(SuspendDialogComponent, {
              data: {
                user: user,
                reportedAccount: reportedAccount,
              },
            });

            dialogRef.afterClosed().subscribe((result) => {
              if (result) {
                this.userService.updateSuspension(userId).subscribe(() => {
                  this.reportService
                    .deleteReportedProblem(reportedUserId)
                    .subscribe(() => {
                      this.retrieveAccounts();
                    });
                });
              }
            });
          } else {
            console.error('Korisnik sa ID-om ' + userId + ' nije pronađen.');
          }
        });
      } else {
        console.error(
          'Prijavljeni nalog sa ID-om ' + reportedUserId + ' nije pronađen.'
        );
      }
    });
  };

  deleteReportedComment = (reportedCommentId: number): void => {
    this.reportService.getReportedComments().subscribe((reportedComments) => {
      const reportedComment = reportedComments.find(
        (c) => c.id === reportedCommentId
      );
      if (reportedComment) {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
          width: '400px',
          data: { name: `komentar: "${reportedComment.reviewText}"` },
        });

        console.log('reviewId: ', reportedComment.reviewId);
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.tutoringOfferService
              .deleteReviewFromOffer(reportedComment.reviewId)
              .subscribe(
                () => {
                  this.reportService
                    .deleteReportedProblem(reportedCommentId)
                    .subscribe(() => {
                      this.retrieveComments();
                    });
                },
                (error) => {
                  console.error('Greška', error);
                }
              );
          }
        });
      } else {
        console.error(
          'Пријављени коментар са ID-ом ' +
            reportedCommentId +
            ' није пронађен.'
        );
      }
    });
  };

  ngOnInit(): void {}
}
