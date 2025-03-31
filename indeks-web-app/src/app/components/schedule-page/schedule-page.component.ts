import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';
import { ScheduleService } from '../../services/schedule.service';
import { ScheduleItem } from '../../model/scheduleItem.model';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-schedule-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css'],
})
export class SchedulePageComponent implements OnInit {
  days = [
    'Ponedjeljak',
    'Utorak',
    'Srijeda',
    'Četvrtak',
    'Petak',
    'Subota',
    'Nedjelja',
  ];
  times = [
    '08:15',
    '09:15',
    '10:15',
    '11:15',
    '12:15',
    '13:15',
    '14:15',
    '15:15',
    '16:15',
    '17:15',
  ];
  options = [
    { label: 'Prva godina', value: '1' },
    { label: 'Druga godina - Računarsko inženjerstvo', value: '2' },
    { label: 'Druga godina - Softversko inženjerstvo', value: '3' },
    { label: 'Treća godina - Računarsko inženjerstvo', value: '4' },
    { label: 'Treća godina - Softversko inženjerstvo', value: '5' },
    { label: 'Četvrta godina - Računarsko inženjerstvo', value: '6' },
    { label: 'Četvrta godina - Softversko inženjerstvo', value: '7' },
    { label: 'Druga godina - Elektronika i telekomunikacije', value: '8' },
    { label: 'Treća godina - Elektronika', value: '9' },
    { label: 'Treća godina - Telekomunikacije', value: '10' },
    { label: 'Četvrta godina - Elektronika', value: '11' },
    { label: 'Četvrta godina - Telekomunikacije', value: '12' },
    { label: 'Druga godina - Elektroenergetika i automatika', value: '13' },
    { label: 'Treća godina - Automatika', value: '14' },
    { label: 'Treća godina - Elektroenergetika', value: '15' },
    { label: 'Četvrta godina - Automatika', value: '16' },
    { label: 'Četvrta godina - Elektroenergetika', value: '17' },
  ];

  scheduleData: string[][] = [];
  selectedOption = '1';
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.loadStudentSchedule();
  }

  private loadStudentSchedule(): void {
    const studentId = this.authService.getUserId();
    console.log('STUDENT ID: ', studentId);

    if (!studentId) {
      this.handleError('Niste prijavljeni!');
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;

    this.scheduleService.getScheduleData(studentId).subscribe({
      next: (items: ScheduleItem[]) => {
        if (!Array.isArray(items)) {
          this.handleError('Neispravan format podataka sa servera.');
          return;
        }
        this.initializeSchedule(items);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Greška pri učitavanju rasporeda:', error);

        if (error.status === 200) {
          this.handleError(
            'Server vratio neočekivan odgovor (HTML umesto JSON-a).'
          );
        } else if (error.status === 404) {
          this.handleError('Raspored nije pronađen.');
        } else {
          this.handleError(`Greška na serveru: ${error.statusText}`);
        }

        this.isLoading = false;
      },
    });
  }

  private initializeSchedule(items: ScheduleItem[]): void {
    this.scheduleData = this.times.map(() => Array(this.days.length).fill(''));

    items.forEach((item) => {
      const timeIndex = this.times.findIndex((t) => t === item.time);
      const dayIndex = item.day;

      if (timeIndex !== -1 && dayIndex >= 0 && dayIndex < this.days.length) {
        const cellContent = item.schedule
          ? `${item.content} [${item.schedule}]`
          : item.content;

        this.scheduleData[timeIndex][dayIndex] = cellContent;
      }
    });
  }

  private handleError(message: string, error?: any): void {
    this.errorMessage = message;
    this.isLoading = false;
    if (error) console.error(error);
  }
}
