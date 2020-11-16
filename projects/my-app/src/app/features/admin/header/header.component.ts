import { CustomHttp } from './../../../core/services/custom-http.service';
import { Subscription } from 'rxjs';
import { ConfirmationService } from './../../../core/services/confirmation.service';
import { NotifyService } from './../../../core/services/notify.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import {
  Router,
  ActivatedRoute,
  UrlTree,
  NavigationEnd,
} from '@angular/router';
import { ProjectsService } from '../../../core/services/projects.service';
import { PagesService } from '../../../core/services/pages.service';

import * as moment from 'moment';

@Component({
  selector: 'my-org-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  list: any = [];
  listProject: any = [];
  select: any = '0';
  current = 'project';
  id: number;
  stateTitle = 'Сводка по проекту';
  stateIcon = 'dashboard';
  childArray: any = [];
  pages: any = [];
  selectedPage: any;
  createEditModal = false;
  imageSrc: any;
  pageName: string;
  editPage: any;
  form: FormGroup;
  selectedBox: any = null;
  projectName: string;
  createProject: boolean;
  showDropdown: boolean;
  projectDropdow: boolean;
  pageDropdown: boolean;
  settingsDropdown: boolean;
  userDropdown: boolean;
  notifyDropdown: boolean;
  notProject: boolean;
  placeholder: any;
  nlist: any = [];
  state: string;
  selectedNotify: any;
  modal: boolean;
  confirmMessage = '';
  equipmentType: string;
  private subscriptions: Subscription[] = [];
  constructor(
    public auth: AuthService,
    public router: Router,
    public projects: ProjectsService,
    private activatedRoute: ActivatedRoute,
    public pagesService: PagesService,
    public translate: TranslateService,
    private fb: FormBuilder,
    private notify: NotifyService,
    private conf: ConfirmationService,
    private customHttp: CustomHttp
  ) {
    translate.addLangs(['ru', 'en']);
    translate.use('ru');
    translate.setDefaultLang('ru');
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const arr = val.url.split('/');
        this.id = Number(arr[arr.length - 1]);
        if (arr) {
          this.select = arr[arr.length - 1];
          if (arr.includes('edit')) {
            this.stateTitle = 'Редактор мнемосхем';
            this.stateIcon = 'edit-blue';
            this.current = 'edit';
          } else if (arr.includes('graphic')) {
            this.stateTitle = 'Графики';
            this.stateIcon = 'graphic-blue';
            this.current = 'graphic';
            if (arr.length === 2) {
              this.select = '0';
            }
          } else if (arr.includes('show')) {
            this.stateTitle = 'Мониторинг';
            this.stateIcon = 'monitor';
            this.current = 'show';
            if (arr.length === 2) {
              this.select = '0';
            }
          } else if (arr.includes('projects')) {
            this.stateTitle = 'Сводка по проекту';
            this.stateIcon = 'dashboard';
            this.current = 'projects';
            if (arr.length === 2) {
              this.select = '0';
            }
          } else if (arr.includes('notifications')) {
            this.stateTitle = 'Оповещения';
            this.stateIcon = 'notification-blue';
            this.current = 'notifications';
            if (arr.length === 2) {
              this.select = '0';
            }
          } else if (arr.includes('report')) {
            this.stateTitle = 'Отчеты';
            this.stateIcon = 'report-blue';
            this.current = 'report';
            if (arr.length === 2) {
              this.select = '0';
            }
          } else if (arr.includes('equipment')) {
            this.stateTitle = 'Оборудование';
            this.stateIcon = 'equipment';
            this.current = 'equipment';
            this.equipmentType = arr[2];
            if (arr.length === 2) {
              this.select = '0';
            }
          } else if (arr.includes('not-project')) {
            this.notProject = true;
          } else if (
            arr.includes('directory') ||
            arr.includes('clients') ||
            arr.includes('users') ||
            arr.includes('not-project') ||
            arr.includes('reset')) {
            this.projectName = 'Выберите проект';
          } else {
            this.select = this.id.toString();
          }
        }
      }
    });
    this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getNotify();
    this.getProjects();
    const pagesSub = this.pagesService.selectedPage$.subscribe((page: any) => {
      this.selectedPage = page;
      this.list = page?.data?.options ? page?.data?.options : [];
      this.getPageById();
    });
    this.subscriptions.push(pagesSub);
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  getProjects() {
    this.projects.projectList().subscribe((res: any) => {
      this.listProject = res;
      this.projectName = res.find((x: any) => x.id === Number(this.select)).data.name;
    });
  }
  changeTab(item: any) {
    localStorage.setItem(`project_${this.id}`, JSON.stringify(item.id));
    this.pagesService.setPage(item);
    this.getPageById();
    this.selectedPage = item;
  }

  getPageById() {
    const getPage = JSON.parse(localStorage.getItem(`project_${this.id}`) as string);
    this.projects.pageList(this.id).subscribe((pages: any) => {
      if (pages) {
        this.pages = pages.filter((item: any) => item.parent === null);
        if (this.pages.length) {
          this.pages.sort((a: any, b: any) => a.data.position - b.data.position);
          if (getPage) {
            pages.find((page: any) => {
              if (page.id === getPage) {
                this.selectedPage = page;
              }
            });
          }
          if (!this.selectedPage) {
            this.selectedPage = this.pages[0];
          }
        } else {
          this.selectedPage = null;
        }
      }
    });
  }
  getNotify() {
    this.notify.getNotifyList({ project: this.id }).subscribe((res: any) => {
      this.nlist = res.results;
      this.nlist = this.nlist.filter((item: any) => item.confirmation === null);
      if (res.results.length !== 0) {
        if (res.results.length >= 10) {
          this.nlist.length = 10;
        }
        this.selectedNotify = this.nlist[0];
        this.state = this.nlist[0]?.data?.state;
        if (this.nlist[0].channel) {
          this.placeholder = `[${moment(this.nlist[0]?.created_at).format('DD.MM.yyyy')} ${moment(this.nlist[0]?.created_at).format('HH:mm:ss')}] ${this.nlist[0]?.channel?.sensor}`;
        } else {
          this.placeholder = `[${moment(this.nlist[0]?.created_at).format('DD.MM.yyyy')} ${moment(this.nlist[0]?.created_at).format('HH:mm:ss')}] ${this.nlist[0]?.user}`;
        }
      }
    });
  }
  changeCriteria(value: any) {
    this.state = value.data?.state;
    if (value.channel) {
      this.placeholder = `[${moment(value.created_at).format('DD.MM.yyyy')} ${moment(value.created_at).format('HH:mm:ss')}] ${value.channel.sensor}`;
    } else {
      this.placeholder = `[${moment(value.created_at).format('DD.MM.yyyy')} ${moment(value.created_at).format('HH:mm:ss')}] ${value.user}`;
    }
    this.selectedNotify = value;
  }
  showModal() {
    this.modal = true;
    this.showDropdown = false;
    this.projectDropdow = false;
    this.pageDropdown = false;
    this.settingsDropdown = false;
    this.userDropdown = false;
    this.notifyDropdown = false;
  }
  changeDropdown(name?: string) {
    if (name === 'show') {
      this.showDropdown = !this.showDropdown;
      this.projectDropdow = false;
      this.pageDropdown = false;
      this.settingsDropdown = false;
      this.userDropdown = false;
      this.notifyDropdown = false;
    } else if (name === 'project') {
      this.showDropdown = false;
      this.projectDropdow = !this.projectDropdow;
      this.pageDropdown = false;
      this.settingsDropdown = false;
      this.userDropdown = false;
      this.notifyDropdown = false;
    } else if (name === 'page') {
      this.showDropdown = false;
      this.projectDropdow = false;
      this.pageDropdown = !this.pageDropdown;
      this.settingsDropdown = false;
      this.userDropdown = false;
      this.notifyDropdown = false;
    } else if (name === 'settings') {
      this.showDropdown = false;
      this.projectDropdow = false;
      this.pageDropdown = false;
      this.settingsDropdown = !this.settingsDropdown;
      this.userDropdown = false;
      this.notifyDropdown = false;
    } else if (name === 'user') {
      this.showDropdown = false;
      this.projectDropdow = false;
      this.pageDropdown = false;
      this.settingsDropdown = false;
      this.userDropdown = !this.userDropdown;
      this.notifyDropdown = false;
    } else if (name === 'notify') {
      this.showDropdown = false;
      this.projectDropdow = false;
      this.pageDropdown = false;
      this.settingsDropdown = false;
      this.userDropdown = false;
      this.notifyDropdown = !this.notifyDropdown;
    } else {
      this.showDropdown = false;
      this.projectDropdow = false;
      this.pageDropdown = false;
      this.settingsDropdown = false;
      this.userDropdown = false;
      this.notifyDropdown = false;
    }
  }

  deletePage(page: any) {
    const question = confirm(`Вы уверены что хотите удалить мнемосхему ${page.data.name}?`);
    if (question) {
      this.projects.deletePage(page.id).subscribe((res: any) => {
        localStorage.removeItem(`project_${this.id}`);
        this.getPageById();
        if (page.id === this.selectedPage.id) {
          if (this.pages.length === 0) {
            this.selectedPage = null;
          }
          this.pagesService.setPage(this.selectedPage);
          window.location.reload();
        }
      });
    } else {
      console.log(question);
    }
  }

  selectProject(value: any) {
    if (value !== '0') {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        if (this.current === 'notifications' || this.current === 'report' || this.current === 'projects') {
          this.router.navigate([`/${this.current}/`, value]);
        } else if (this.current === 'equipment') {
          this.router.navigate([`/${this.current}/${this.equipmentType}/`, value]);
        } else if (this.current === 'show' || this.current === 'edit') {
          this.router.navigate([`/projects/${this.current}`, value]);
        } else {
          this.router.navigate([`/projects/`, value]);
        }
      });
    } else {
      this.router.navigate(['/projects/' + value]);
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const data = this.form.get('file') || { setValue: () => {} };
      data.setValue(file);
      this.onSubmitf();
    }
  }
  onSubmitf() {
    const formModel = this.prepareSave();
    this.projects.uploadImage(formModel).subscribe((res) => {
      this.imageSrc = res;
    });
  }

  closeModal() {
    this.createEditModal = false;
  }
  changePageName(name: string) {
    this.pageName = name;
  }
  openModal(page?: any, child?: boolean) {
    if (page) {
      this.editPage = page;
      this.pageName = page.data.name;
      this.imageSrc = {};
      this.imageSrc.file = page.data.image;
      if (child) {
        // this.parent = page.id;
        this.editPage = null;
        this.imageSrc = null;
        this.pageName = '';
      }
    } else {
      this.editPage = null;
      this.imageSrc = null;
      this.pageName = '';
    }
    this.createEditModal = true;
    this.showDropdown = false;
    this.projectDropdow = false;
    this.pageDropdown = false;
    this.settingsDropdown = false;
    this.userDropdown = false;
    this.notifyDropdown = false;
  }
  openModalChild(page?: any, isNew?: boolean) {
    if (isNew) {
      this.editPage = null;
      this.imageSrc = null;
      this.pageName = '';
    } else {
      this.editPage = page;
      this.pageName = page.data.name;
      this.imageSrc = {};
      this.imageSrc.file = page.data.image;
    }
    this.createEditModal = true;
  }

  createPage() {
    const data = {
      data: {
        name: this.pageName,
        image: this.imageSrc.file,
        position: this.pages.length
          ? this.pages[this.pages.length - 1].position + 1
          : 0,
      },
      project: this.id,
      // parent: this.parent
    };
    this.projects.createPage(data).subscribe(
      (res) => {
        this.pagesService.setPage(res);
        this.getPageById();
        this.createEditModal = false;
      },
      (error) => {
        alert(JSON.stringify(error.error).replace(/[{()}]/g, ''));
      });
  }

  updatePage() {
    this.editPage.data.name = this.pageName;
    this.editPage.data.image = this.imageSrc.file;
    this.projects.updatePage(this.editPage).subscribe((res) => {
      this.pagesService.setPage(res);
      this.getPageById();
      this.createEditModal = false;
    });
  }
  private prepareSave(): any {
    const input = new FormData();
    const data = this.form.get('file') || { value: null };
    input.append('file', data.value);
    return input;
  }
  closeNotifyModal() {
    this.modal = false;
  }

  saveConfirmation(confirmMessage: string) {
    const data = {
      notification: this.selectedNotify.id,
      data: {
        text: confirmMessage,
      },
    };
    this.conf.createConfirmation(data);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getNotify();
        this.closeNotifyModal();
      }
    });
  }
}
