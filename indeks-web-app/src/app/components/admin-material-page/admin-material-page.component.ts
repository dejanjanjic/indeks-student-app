import { Component, inject } from '@angular/core';
import { BaseTableComponent } from '../base-table/base-table.component';
import { MaterialService } from '../../services/material.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-material-table',
  standalone: true,
  imports: [BaseTableComponent],
  templateUrl: './admin-material-page.component.html'
})
export class AdminMaterialPageComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  materialService = inject(MaterialService);

  headerMap = {
    id: 'ID',
    name: 'Naziv materijala',
    subject: 'Predmet',
    owner: 'Vlasnik',
    entityName: 'material',
  };

  retrieveDataFunction = () => this.materialService.getAllMaterials();

 

  filterDataFunction = (keyword: string) =>
    this.materialService.getAllMaterials().pipe(
      map(materials => materials.filter(m =>
        m.name.toLowerCase().includes(keyword.toLowerCase()) 
      ))
    );

  deleteDataFunction = (id: number) =>
    this.materialService.deleteMaterial(id);


}