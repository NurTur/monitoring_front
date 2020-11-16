import { CustomHttp } from './../../../core/services/custom-http.service';
import { ProjectsService } from 'projects/my-app/src/app/core/services/projects.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'my-org-client-modal',
  templateUrl: './client-modal.component.html',
  styleUrls: ['./client-modal.component.scss']
})
export class ClientModalComponent implements OnInit {
  @Input() client: any;
  @Output() changeModal = new EventEmitter<any>();
  @Output() getClients = new EventEmitter<any>();
  users: any = [];
  name: string;
  selectedUsers: any = [];
  availableUsers: any = [];
  highlightedUsers: any = [];
  constructor(private projects: ProjectsService, private customHttp: CustomHttp) { }

  ngOnInit() {
    this.getUsers();
  }
  getUsers() {
    this.projects.getUsersList().subscribe((users: any[]) => {
      this.users = users;
      if (users) {
        if (this.client) {
          this.name = this.client.data.name;
          this.projects.getClientUsers(this.client.id).subscribe((res: any) => {
            if (res) {
              this.selectedUsers = res;
              this.availableUsers = users.filter((item: any) => !res.map((x: any) => x.id).includes(item.id));
            }
          });
        } else {
          this.availableUsers = users;
        }
      }
    });
  }


  highlightUser(user: any) {
    if (this.highlightedUsers.includes(user)) {
      this.highlightedUsers.splice(this.highlightedUsers.indexOf(user), 1);
    } else {
      this.highlightedUsers.push(user);
    }
  }

  moveToSelected() {
    this.highlightedUsers.filter((item: any) => this.availableUsers.includes(item)).map((m: any) => {
        this.highlightedUsers = this.highlightedUsers.filter((x: any) => !this.availableUsers.includes(x));
        this.availableUsers.splice(this.availableUsers.indexOf(m), 1);
        this.selectedUsers.push(m);
      });
  }

  moveToAvailable() {
    this.highlightedUsers
      .filter((_: any) => this.selectedUsers.includes(_))
      .map((_: any) => {
        // tslint:disable-next-line: max-line-length
        this.highlightedUsers = this.highlightedUsers.filter((_: any) => !this.selectedUsers.includes(_));
        this.selectedUsers.splice(this.selectedUsers.indexOf(_), 1);
        this.availableUsers.push(_);
      });
  }
  selectedAll() {
    this.selectedUsers = this.users;
    this.availableUsers = [];
  }
  clearAll() {
    this.selectedUsers = [];
    this.availableUsers = this.users;
  }
  createClient(edit: boolean) {
    const data = {
      data: {
        name: this.name,
      },
      users: this.selectedUsers.map((_: any) => _.id)
    };
    if (edit) {
      this.projects.updateClient(data, this.client.id);
      this.customHttp.answer$.subscribe((answer: boolean) => {
        if (answer) {
          this.getClients.emit();
          this.changeModal.emit();
        }
      });
    } else {
      this.projects.createClient(data);
      this.customHttp.answer$.subscribe((answer: boolean) => {
        if (answer) {
          this.getClients.emit();
          this.changeModal.emit();
        }
      });
    }
  }
}
