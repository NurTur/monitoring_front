import { CustomHttp } from './../../../../core/services/custom-http.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from 'projects/my-app/src/app/core/services/notify.service';
import { ConfirmationService } from 'projects/my-app/src/app/core/services/confirmation.service';
import { AuthService } from 'projects/my-app/src/app/core/services/auth.service';
import { WSService } from 'projects/my-app/src/app/core/services/ws.service';
import * as moment from 'moment';

@Component({
  selector: 'my-org-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

  id: any;
  list: any = [];
  selectedNotify: any;
  modal = false;
  nModal = false;
  confirmMessage = '';
  fixed = 'custom';
  type = 'month';
  filterForm = {
    state: '',
    not_confirmed: '',
    start_datetime: '',
    end_datetime: '',
    channel: '',
    id: null,
    project: null,
    page: 1
  };
  loader = false;
  greeting: any;
  name: string;
  pagination: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private notify: NotifyService,
    private conf: ConfirmationService,
    private auth: AuthService,
    private ws: WSService,
    private customHttp: CustomHttp
  ) {
    activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.filterForm.id = this.id;
    });
  }

  ngOnInit(): void {
    this.getNotify();
    this.ws.connect(this.id);
    this.ws.getData().subscribe((res: any) => {
      if (res) {
        this.list = this.list.filter((x: any) => x.id !== res.id);
        this.list.unshift(res);
      }
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.ws.reject(this.id);
  }

  downloadReport() {
    this.notify.getExcel().subscribe((res) => {
      this.downloadFile(res);
    });
  }

  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  getNotify() {
    this.filterForm.project = this.id;
    if (this.fixed === 'custom') {
      if (this.type === 'today') {
        this.filterForm.start_datetime = moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00';
        this.filterForm.end_datetime = moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59';
      } else if (this.type === 'week') {
        this.filterForm.start_datetime = moment(new Date().setDate(new Date().getDate() - 7)).format('YYYY-MM-DD') + ' 00:00:00';
        this.filterForm.end_datetime = moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59';
      } else if (this.type === 'month') {
        this.filterForm.start_datetime = moment(new Date().setMonth(new Date().getMonth() - 1)).format('YYYY-MM-DD') + ' 00:00:00';
        this.filterForm.end_datetime = moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59';
      } else {
        this.filterForm.start_datetime = '';
        this.filterForm.end_datetime = '';
      }
    }
    if (this.filterForm.start_datetime !== '' && this.filterForm.end_datetime !== '') {
      this.filterForm.start_datetime = moment(this.filterForm.start_datetime).format('YYYY-MM-DD') + ' 00:00:00';
      this.filterForm.end_datetime = moment(this.filterForm.end_datetime).format('YYYY-MM-DD') + ' 23:59:59';
    }
    if (this.id !== '0') {
      this.loader = true;
      this.notify.getNotifyList(this.filterForm).subscribe((res: any) => {
        this.list = res.results;
        this.pagination = res;
        this.loader = false;
      });
    }
  }

  showModal(value: string) {
    if (value === 'notification') {
      this.nModal = true;
    } else {
      this.modal = true;
    }
  }

  closeModal() {
    this.modal = false;
  }
  closeNotificationModal() {
    this.nModal = false;
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
        this.closeModal();
      }
    });
  }
  addNotification(data: any) {
    const notification = {
      project: this.id,
      emails: [data.email],
      channel: data.channel,
      data: {
        message: data.message,
        state: data.state,
        sound: data.sound,
      }
    };
    this.notify.createNotification(notification);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.closeNotificationModal();
        this.getNotify();
      }
    });
  }
}
