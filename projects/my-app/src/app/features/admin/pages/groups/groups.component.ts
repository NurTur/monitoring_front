import { CustomHttp } from './../../../../core/services/custom-http.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from 'projects/my-app/src/app/core/services/projects.service';

@Component({
  selector: 'my-org-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
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
  permissions: any[] = [];

  currentUser: any;
  constructor(
    private projects: ProjectsService,
    private activatedRoute: ActivatedRoute,
    private customHttp: CustomHttp
  ) {
    activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });
  }

  @Input() createModal: any = {
    name: '',
    highlightedGroups: [],
    selectedGroups: [],
    availableGroups: [],
  };

  ngOnInit(): void {
    this.getGroup();
  }

  getGroup() {
    this.projects.getGroupList().subscribe((res: any) => {
      this.users = res;
    });
    this.projects.getPermissionsList().subscribe((res: any) => {
      this.createModal.availableGroups = res;
      this.permissions = res;
    });
  }

  highlightUser(user: any) {
    if (this.createModal.highlightedGroups.includes(user)) {
      this.createModal.highlightedGroups.splice(this.createModal.highlightedGroups.indexOf(user), 1 );
    } else {
      this.createModal.highlightedGroups.push(user);
    }
  }

  moveToSelected() {
    this.createModal.highlightedGroups
      .filter((_: any) => this.createModal.availableGroups.includes(_))
      .map((_: any) => {
        this.createModal.highlightedGroups = this.createModal.highlightedGroups.filter(
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
          (_: any) => !this.createModal.selectedGroups.includes(_)
        );
        this.createModal.selectedGroups.splice(
          this.createModal.selectedGroups.indexOf(_),
          1
        );
        this.createModal.availableGroups.push(_);
      });
  }

  editUser(user: any) {
    console.log(user);
    this.createModal.name = user.name;
    this.currentUser = user;
    this.createModal.selectedGroups = user.permissions;
    this.createModal.availableGroups = this.permissions.filter((item: any) => !user.permissions.map((x: any) => x.id).includes(item.id));
    this.modals.add = true;
    this.modals.edit = true;
  }
  selectedAll() {
    this.createModal.selectedGroups = this.permissions;
    this.createModal.availableGroups = [];
  }
  clearAll() {
    this.createModal.selectedGroups = [];
    this.createModal.availableGroups = this.permissions;
  }

  closeModal() {
    this.modals.add = false;
    this.modals.delete = false;
    this.modals.history = false;
    this.modals.edit = false;
    this.createModal.selectedGroups = [];
    this.createModal.name = '';
  }

  deleteUser(user: any) {
    this.modals.delete = true;
    this.currentUser = user;
  }

  deleteClientFinal() {
    this.projects.deleteUser(this.currentUser.id).subscribe((res) => {
      this.getGroup();
    });
  }

  createUser() {
    const data = {
      name: this.createModal.name,
      permissions: this.createModal.selectedGroups
    };
    if (this.modals.edit) {
      this.projects.updateGroup(data, this.currentUser.id);
      this.customHttp.answer$.subscribe((answer: boolean) => {
        if (answer) {
          this.getGroup();
          this.modals.add = false;
        }
      });
      return;
    }
    this.projects.createGroup(data);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getGroup();
        this.modals.add = false;
      }
    });
  }
}
