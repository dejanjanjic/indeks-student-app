import { CommonModule, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-base-table',
  imports: [
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatInputModule,
    RouterModule,
    DatePipe,
    MatTooltipModule,
  ],
  templateUrl: './base-table.component.html',
  styleUrl: './base-table.component.css',
  standalone: true,
})
export class BaseTableComponent<T extends { id: number }>
  implements AfterViewInit
{
  @Input() displayedColumns!: string[];
  @Input() service: any;
  @Input() headerMap: { [key: string]: string } = {};
  @Input() dateColumns: string[] = [];
  @Input() toggleColumns: string[] = [];
  @Input() actionButtons: string[] = [];
  @Input() dateFormat: string = 'dd.MM.yyyy.';
  @Input() retrieveDataFunction: any;
  @Input() addDataFunction: any;
  @Input() deleteDataFunction: any;
  @Input() updateDataFunction: any;
  @Input() filterDataFunction: any;
  @Input() viewDetailsFunction: any;
  @Input() toggleLabels: { [key: string]: { true: string; false: string } } =
    {};

  @Output() toggleChange = new EventEmitter<{
    id: number;
    column: string;
    value: boolean;
  }>();

  private _paginator!: MatPaginator;
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator) {
      this._paginator = paginator;
      this.dataSource.paginator = this._paginator;
    }
  }
  dataSource = new MatTableDataSource<T>();
  resultsLength = 0;

  searchTerm = '';
  isLoading = false;

  constructor(private dialog: MatDialog) {}

  ngAfterViewInit(): void {
    this.loadData();
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.filter(this.searchTerm.trim());
    } else {
      this.loadData();
    }
    this.dataSource.paginator?.firstPage();
  }

  filter(keyword: string) {
    this.dataSource.data = [];
    this.resultsLength = 0;
    this.isLoading = true;
    this.filterDataFunction(keyword).subscribe({
      next: (result: T[]) => {
        this.dataSource.data = result;
        this.resultsLength = result.length;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  refreshTable(): void {
    this.searchTerm = '';
    this.loadData();
    this.dataSource.paginator?.firstPage();
  }

  loadData(): void {
    this.dataSource.data = [];
    this.resultsLength = 0;
    this.isLoading = true;
    this.retrieveDataFunction().subscribe({
      next: (result: T[]) => {
        this.dataSource.data = result;
        this.resultsLength = result.length;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  deleteItem(id: number): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { name: `${this.headerMap['entityName']} ${id}` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        const deleteObservable = this.deleteDataFunction
          ? this.deleteDataFunction(id)
          : this.service.deleteById(id);

        deleteObservable.subscribe({
          next: () => this.refreshTable(),
          error: (err: any) => {
            this.isLoading = false;
            console.error(err);
          },
        });
      }
    });
  }

  getHeader(col: string): string {
    return this.headerMap[col] || col;
  }

  isDateColumn(col: string): boolean {
    return this.dateColumns.includes(col);
  }

  isToggleColumn(col: string): boolean {
    return this.toggleColumns.includes(col);
  }

  onToggleChange(id: number, column: string, value: boolean): void {
    this.toggleChange.emit({ id, column, value });
  }

  getToggleLabel(column: string, value: boolean): string {
    if (this.toggleLabels[column]) {
      return value
        ? this.toggleLabels[column].true
        : this.toggleLabels[column].false;
    }
    return value ? 'Da' : 'Ne';
  }
}
