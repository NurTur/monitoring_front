import { ProjectsService } from 'projects/my-app/src/app/core/services/projects.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'my-org-client-table',
  templateUrl: './client-table.component.html',
  styleUrls: ['./client-table.component.scss']
})
export class ClientTableComponent implements OnInit {
  @Input() client: any;
  @Output() getClients = new EventEmitter<any>();
  modal: boolean;
  deleteModal: boolean;
  constructor(private projects: ProjectsService) { }

  ngOnInit(): void {
  }
  changeModal() {
    this.modal = !this.modal;
  }
  openDeleteModal() {
    this.deleteModal = true;
  }
  removeClient() {
    this.projects.deleteClient(this.client.id).subscribe(() => {
      this.getClients.emit();
    });
  }
}
