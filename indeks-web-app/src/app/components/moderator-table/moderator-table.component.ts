import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModeratorService } from '../../services/moderator.service';
import { BaseTableComponent } from '../base-table/base-table.component';

@Component({
  selector: 'app-moderator-table',
  standalone: true,
  imports: [BaseTableComponent],
  templateUrl: './moderator-table.component.html',
  styleUrls: ['./moderator-table.component.css'],
})
export class ModeratorTableComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public moderatorService = inject(ModeratorService);

  headerMap = {
    id: 'ID',
    firstName: 'Ime',
    lastName: 'Prezime',
    materialPath: 'Putanja materijala',
    email: 'Email',
    entityName: 'moderator',
  };

  // Funkcija za dobijanje podataka
  retrieveDataFunction = () => {
    return this.moderatorService.getAllModerators();
  };

  // Funkcija za dodavanje podataka
  addDataFunction = () => {
    this.router.navigate(['add-moderator'], { relativeTo: this.route });
  };

  // Funkcija za filtriranje podataka
  filterDataFunction = (keyword: string) => {
    return this.moderatorService.getAllModerators(); // fallback
  };

  // Funkcija za ažuriranje podataka
  updateDataFunction = (id: number) => {
    this.router.navigate([`update-moderator/${id}`], { relativeTo: this.route });
  };

  // Funkcija za brisanje moderatora
  deleteDataFunction = (id: number) => {
    return this.moderatorService.deleteModerator(id);
  };
}
