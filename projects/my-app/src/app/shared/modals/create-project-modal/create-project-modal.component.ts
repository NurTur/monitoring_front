import { AuthService } from 'projects/my-app/src/app/core/services/auth.service';
import { ProjectsService } from './../../../core/services/projects.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'my-org-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.scss'],
})
export class CreateProjectModalComponent implements OnInit {
  @Input() editPage: any;
  @Input() imageSrc: any;
  @Input() projectName: any;
  @Input() projectClient: any;
  @Input() projectActive: any;
  @Input() projectID: number;
  @Output() updatePage = new EventEmitter<any>();
  @Output() createPage = new EventEmitter<any>();
  @Output() fileChange = new EventEmitter<any>();
  @Output() changePageName = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<any>();

  clientList: any;
  projectStatus: any = 1;

  constructor(
    private projects: ProjectsService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.projects.getClientList().subscribe((res: any) => {
      this.clientList = res.filter((item: any) => item.users.find((user: any) => user.email === this.auth.getUser.email));
    });
    if (this.projectID) {
      this.projects.projectById(this.projectID).subscribe((_: any) => {
        this.projectClient = _.client.id;
      });
    }
  }
  create() {
    this.projects
      .projectCreate({
        data: {
          name: this.projectName,
          is_active: this.projectStatus === 1,
        },
        client: this.projectClient,
        created_at: Date.now(),
      })
      .subscribe((res: any) => {
        setTimeout(() => {
          window.location.href = `/projects/${res.id}`;
        }, 2000);
        this.closeModal.emit();
      });
  }
  update() {
    this.projects
      .projectUpdate(
        {
          data: {
            name: this.projectName,
            is_active: this.projectStatus === 1,
          },
          id: this.projectID,
          client: this.projectClient,
          updated_at: Date.now(),
        },
        this.projectID
      )
      .subscribe((res) => {
        window.location.reload();
      });
  }
}
