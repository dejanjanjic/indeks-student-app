import { Component, inject } from '@angular/core';
import { ElementaryGroupService } from '../../services/elementary-group.service';
import { BaseTableComponent } from '../base-table/base-table.component';

@Component({
  selector: 'app-elementary-group-table',
  imports: [BaseTableComponent],
  templateUrl: './elementary-group-table.component.html',
  styleUrl: './elementary-group-table.component.css',
})
export class ElementaryGroupTableComponent {
  elementaryGroupService: ElementaryGroupService = inject(
    ElementaryGroupService
  );
  headerMap = {
    id: 'Id',
    name: 'Name',
    size: 'Size',
    entityName: 'elementary group',
  };

  retrieveDataFunction = () => this.elementaryGroupService.getAllInfo();
}
