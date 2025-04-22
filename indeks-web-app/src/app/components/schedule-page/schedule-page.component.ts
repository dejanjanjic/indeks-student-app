import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';
import { ScheduleService } from '../../services/schedule.service';
import { ScheduleItem } from '../../model/scheduleItem.model';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { UpdateSchedulePayload } from '../../model/schedule.model';

@Component({
  selector: 'app-schedule-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css'],
})
export class SchedulePageComponent implements OnInit, AfterViewChecked {
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
    '8:15',
    '9:15',
    '10:15',
    '11:15',
    '12:15',
    '13:15',
    '14:15',
    '15:15',
    '16:15',
    '17:15',
    '18:15',
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

  scheduleData: ScheduleItem[][] = [];
  selectedOption: string | null = '1';
  isLoading = true;
  errorMessage: string | null = null;
  isEditable = false;
  editingTimeIndex: number | null = null;
  editingDayIndex: number | null = null;
  @ViewChild('editInput') editInput: ElementRef | null = null;

  constructor(
    private authService: AuthService,
    private scheduleService: ScheduleService,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewChecked(): void {
    if (
      this.isEditable &&
      this.editInput &&
      document.activeElement !== this.editInput.nativeElement
    ) {
      setTimeout(() => {
        this.editInput?.nativeElement.focus();
      });
    }
  }

  ngOnInit(): void {
    this.loadInitialSchedule();
  }

  loadInitialSchedule(): void {
    const studentId = this.authService.getUserId();
    console.log('loadInitialSchedule: Student ID:', studentId);

    if (studentId) {
      this.scheduleService.getScheduleData(studentId).subscribe({
        next: (items: ScheduleItem[]) => {
          console.log('loadInitialSchedule: Received items:', items);
          this.initializeSchedule(items);
          this.isLoading = false;
        },
        error: (error) => {
          console.error(
            'loadInitialSchedule: Greška pri dohvaćanju rasporeda.',
            error
          );
          this.handleError('Greška pri dohvaćanju rasporeda.', error);
        },
      });
    } else {
      this.handleError('Korisnik nije prijavljen.');
    }
  }

  loadSelectedSchedule(): void {
    console.log('loadSelectedSchedule: selectedOption:', this.selectedOption);
    console.log('loadSelectedSchedule: Funkcija je pozvana!');
    if (this.selectedOption !== null) {
      this.updateScheduleGroupOnBackend(this.selectedOption);
      this.loadStudentSchedule(this.authService.getUserId());
    } else {
      this.handleError('Niste odabrali raspored!');
    }
  }

  async loadStudentSchedule(studentId: number | null): Promise<void> {
    console.log('loadStudentSchedule: Student ID:', studentId);

    if (!studentId) {
      this.handleError('Korisnik nije prijavljen!');
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;

    try {
      const items: ScheduleItem[] = (await this.scheduleService
        .getScheduleData(studentId)
        .toPromise()) as ScheduleItem[];
      console.log('loadStudentSchedule: Received items (async):', items);
      this.initializeSchedule(items);
      this.isLoading = false;
    } catch (error: any) {
      console.error(
        'loadStudentSchedule: Greška pri dohvaćanju rasporeda (async).',
        error
      );
      this.handleError('Greška pri dohvaćanju rasporeda.', error);
      this.isLoading = false;
    }
  }

  private initializeSchedule(items: ScheduleItem[]): void {
    this.scheduleData = this.times.map((time) =>
      this.days.map((_, dayIndex) => ({
        id: 0,
        content: '',
        day: dayIndex,
        time: time,
        schedule: '',
      }))
    );

    items.forEach((item) => {
      const timeIndex = this.times.findIndex((t) => t === item.time);
      const dayIndex = item.day;

      if (timeIndex !== -1 && dayIndex >= 0 && dayIndex < this.days.length) {
        this.scheduleData[timeIndex][dayIndex] = item;
      }
    });
  }

  private handleError(message: string, error?: any): void {
    this.errorMessage = message;
    this.isLoading = false;
    if (error) console.error(error);
  }

  toggleEditMode() {
    this.isEditable = !this.isEditable;
    if (!this.isEditable) {
      this.editingTimeIndex = null;
      this.editingDayIndex = null;
    }
  }

  startEdit(timeIndex: number, dayIndex: number) {
    if (this.isEditable) {
      this.editingTimeIndex = timeIndex;
      this.editingDayIndex = dayIndex;
    }
  }

  finishEdit() {
    if (
      this.isEditable &&
      this.editingTimeIndex !== null &&
      this.editingDayIndex !== null
    ) {
      const cell =
        this.scheduleData[this.editingTimeIndex][this.editingDayIndex];
      const studentId = this.authService.getUserId();
      console.log('finishEdit: Studentski id', studentId);

      if (!studentId) {
        this.snackBar.open('Niste prijavljeni.', 'Zatvori', { duration: 5000 });
        return;
      }

      const payload = {
        day: this.editingDayIndex,
        time: this.times[this.editingTimeIndex],
        content: cell.content,
        studentId: studentId,
      } as Partial<ScheduleItem>;
      console.log('finishEdit: Saljemo na backend:', payload);
      if (cell.id && cell.id !== 0) {
        this.scheduleService.updateScheduleItem(cell.id, payload).subscribe({
          next: (response) => {
            console.log('finishEdit: Stavka uspješno ažurirana:', response);
            this.editingTimeIndex = null;
            this.editingDayIndex = null;
            this.loadStudentSchedule(studentId);
          },
          error: (error) => {
            console.error('finishEdit: Greška pri ažuriranju stavke:', error);
            this.snackBar.open('Greška pri ažuriranju stavke.', 'Zatvori', {
              duration: 5000,
            });
          },
        });
      } else {
        this.scheduleService.createScheduleItem(payload).subscribe({
          next: (newItem) => {
            console.log('finishEdit: Nova stavka uspješno kreirana:', newItem);
            this.editingTimeIndex = null;
            this.editingDayIndex = null;
            this.loadStudentSchedule(studentId);
          },
          error: (error) => {
            console.error(
              'finishEdit: Greška pri kreiranju nove stavke:',
              error
            );
            this.snackBar.open('Greška pri kreiranju nove stavke.', 'Zatvori', {
              duration: 5000,
            });
          },
        });
      }
    }
  }

  updateScheduleGroupOnBackend(groupId: string): void {
    const studentId = this.authService.getUserId();
    if (studentId) {
      const payload: UpdateSchedulePayload = {
        id: studentId,
        num: groupId,
      };
      this.scheduleService.updateScheduleGroup(payload).subscribe({
        next: (response) => {
          console.log(
            'updateScheduleGroupOnBackend: Grupa uspješno ažurirana:',
            response
          );
          this.snackBar.open('Grupa rasporeda je ažurirana.', 'Zatvori', {
            duration: 3000,
          });
          this.loadStudentSchedule(studentId);
        },
        error: (error: any) => {
          console.error(
            'updateScheduleGroupOnBackend: Greška pri ažuriranju grupe:',
            error
          );
          console.error('Status kod greške:', error.status);
          console.error('Tekst statusa greške:', error.statusText);
          console.error('Tijelo greške:', error.error);
          this.snackBar.open(
            'Greška pri ažuriranju grupe rasporeda.',
            'Zatvori',
            { duration: 5000 }
          );
        },
      });
    } else {
      this.snackBar.open('Niste prijavljeni.', 'Zatvori', { duration: 5000 });
    }
  }
}
