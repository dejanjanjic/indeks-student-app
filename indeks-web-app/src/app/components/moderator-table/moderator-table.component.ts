import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModeratorService } from '../../services/moderator.service';
import { BaseTableComponent } from '../base-table/base-table.component';
import { map } from 'rxjs/operators';

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
    materialPath: 'Godina zaduženja',
    email: 'Email',
    entityName: 'moderator',
  };

  // Funkcija za dobijanje podataka koja formatira materialPath ako je potrebno
  retrieveDataFunction = () => {
    return this.moderatorService.getAllModerators().pipe(
      map(moderators => moderators.map(moderator => ({
        ...moderator,
        // Formatiranje materialPath-a da prikaže godinu sa sufiksom ako je broj
        materialPath: this.formatMaterialPath(moderator.materialPath)
      })))
    );
  };

  // Pomoćna funkcija za formatiranje materialPath-a kao godine
  private formatMaterialPath(path: number): string {
    const year = path;
    if (!isNaN(year) && year > 0 && year <= 5) {
      return `${year}. godina`;
    }
    return typeof path === 'number' ? path.toString() : 'Nije zadužen';
  }

  // Funkcija za dodavanje podataka
  addDataFunction = () => {
    this.router.navigate(['add-moderator'], { relativeTo: this.route });
  };

  // Funkcija za filtriranje podataka
  filterDataFunction = (keyword: string) => {
    // Ovde biste trebali implementirati stvarnu logiku filtriranja
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