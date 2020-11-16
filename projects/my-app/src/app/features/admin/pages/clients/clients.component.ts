import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'projects/my-app/src/app/core/services/projects.service';

@Component({
  selector: 'my-org-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  id: any;
  clients: any[] = [];
  modal: boolean;
  constructor(private projects: ProjectsService) {}

  ngOnInit() {
    this.getClients();
  }
  getClients() {
    this.projects.getClientList().subscribe((clients: any) => {
      this.clients = clients;
    });
  }

  changeModal() {
    this.modal = !this.modal;
  }

}
