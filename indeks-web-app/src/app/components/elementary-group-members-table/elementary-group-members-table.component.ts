import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementaryGroupChatMemberService } from '../../services/elementary-group-chat-member.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { BaseTableComponent } from '../base-table/base-table.component';

@Component({
  selector: 'app-elementary-group-members-table',
  imports: [BaseTableComponent],
  templateUrl: './elementary-group-members-table.component.html',
  styleUrl: './elementary-group-members-table.component.css',
})
export class ElementaryGroupMembersTableComponent {
  private route = inject(ActivatedRoute);
  private id = this.route.snapshot.paramMap.get('id');

  elementaryGroupChatMemberService: ElementaryGroupChatMemberService = inject(
    ElementaryGroupChatMemberService
  );
  headerMap = {
    firstName: 'Ime',
    lastName: 'Prezime',
    email: 'Mejl',
    entityName: 'elementary group chat member',
  };

  retrieveDataFunction = () =>
    this.elementaryGroupChatMemberService.getMembersByGroupId(
      parseInt(this.id!)
    );

  filterDataFunction = (keyword: string) =>
    this.elementaryGroupChatMemberService.getByKeyword(this.id!, keyword);
  deleteDataFunction = (id: number) =>
    this.elementaryGroupChatMemberService.deleteFromGroup(
      parseInt(this.id!),
      id
    );
}
