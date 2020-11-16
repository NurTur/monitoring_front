import { CustomHttp } from './../../../../core/services/custom-http.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from 'projects/my-app/src/app/core/services/projects.service';

@Component({
  selector: 'my-org-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  id: any;
  controllers: any;
  listProject: any;
  projectName: any;
  models: any;

  modals = {
    add: false,
    delete: false,
    history: false,
    edit: false,
  };

  clients: any[] = [];
  users: any[] = [];
  groups: any[] = [];

  currentUser: any;
  constructor(private projects: ProjectsService, private customHttp: CustomHttp) {}

  @Input() createModal: any = {
    email: '',
    first_name: '',
    last_name: '',
    pass1: '',
    pass2: '',
    highlightedGroups: [],
    selectedGroups: [],
    availableGroups: [],
    is_staff: true,
    is_active: true,
  };

  ngOnInit() {
    this.getUsers();
  }
  getUsers() {
    this.projects.getUsersList().subscribe((res: any) => {
      this.users = res;
    });
    this.projects.getGroupList().subscribe((res: any) => {
      this.groups = res;
      this.createModal.availableGroups = res;
    });
  }
  highlightUser(user: any) {
    if (this.createModal.highlightedGroups.includes(user)) {
        this.createModal.highlightedGroups.splice(this.createModal.highlightedGroups.indexOf(user), 1);
    }
    else {
      this.createModal.highlightedGroups.push(user);
    }
  }

  moveToSelected() {
    this.createModal.highlightedGroups
      .filter((_: any) => this.createModal.availableGroups.includes(_))
      .map((_: any) => {
        this.createModal.highlightedGroups = this.createModal.highlightedGroups.filter(
          // tslint:disable-next-line: no-shadowed-variable
          (_: any) => !this.createModal.availableGroups.includes(_)
        );
        this.createModal.availableGroups.splice(
          this.createModal.availableGroups.indexOf(_),
          1
        );
        this.createModal.selectedGroups.push(_);
      });
  }

  moveToAvailable() {
    this.createModal.highlightedGroups
      .filter((_: any) => this.createModal.selectedGroups.includes(_))
      .map((_: any) => {
        this.createModal.highlightedGroups = this.createModal.highlightedGroups.filter(
          // tslint:disable-next-line: no-shadowed-variable
          (_: any) => !this.createModal.selectedGroups.includes(_)
        );
        this.createModal.selectedGroups.splice(
          this.createModal.selectedGroups.indexOf(_),
          1
        );
        this.createModal.availableGroups.push(_);
      });
  }
  selectedAll() {
    this.createModal.selectedGroups = this.groups;
    this.createModal.availableGroups = [];
  }
  clearAll() {
    this.createModal.selectedGroups = [];
    this.createModal.availableGroups = this.groups;
  }
  addUser() {
    this.modals.add = true;
    this.modals.edit = false;
    this.createModal = {
      email: '',
      first_name: '',
      last_name: '',
      pass1: '',
      pass2: '',
      highlightedGroups: [],
      selectedGroups: [],
      availableGroups: this.groups,
      is_staff: true,
      is_active: true,
    };
  }

  editUser(user: any) {
    this.currentUser = user;
    this.modals.add = true;
    this.modals.edit = true;
    this.createModal = {
      ...user,
      selectedGroups: user.groups,
      availableGroups: this.groups.filter(
        (_: any) => !user.groups.map((x: any) => x.id).includes(_.id)
      ),
      highlightedGroups: []
    };
  }

  closeModal() {
    this.modals.add = false;
    this.modals.delete = false;
    this.modals.history = false;
    this.modals.edit = false;
  }

  deleteUser(user: any) {
    this.modals.delete = true;
    this.currentUser = user;
  }

  deleteClientFinal() {
    this.projects.deleteUser(this.currentUser.id).subscribe((res) => {
      this.getUsers();
      this.closeModal();
    });
  }

  createUser() {
    const data = {
      first_name: this.createModal.first_name,
      last_name: this.createModal.last_name,
      email: this.createModal.email,
      is_staff: this.createModal.is_staff,
      is_active: this.createModal.is_active,
      password: this.createModal.pass1,
      password_confirm: this.createModal.pass2,
      groups: this.createModal.selectedGroups,
    };
    if (this.modals.edit) {
      this.projects.updateUser(data, this.currentUser.id);
      this.customHttp.answer$.subscribe((answer: boolean) => {
        if (answer) {
          this.getUsers();
          this.closeModal();
        }
      });
      return;
    }
    this.projects.createUser(data);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getUsers();
        this.closeModal();
      }
    });
  }
}
