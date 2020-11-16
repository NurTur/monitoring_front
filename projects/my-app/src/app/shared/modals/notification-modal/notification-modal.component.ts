import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'my-org-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss']
})
export class NotificationModalComponent implements OnInit {

  @Input() selectedNotify: any;
  @Input() confirmMessage: string;
  @Input() modal: boolean;
  @Output() saveConfirmation = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  returnDiffDate(date: string) {
    const now = moment(date);
    // return moment.utc(now.diff(date)).format('HH:mm:ss');
    return now.fromNow();
  }

  save() {
    this.saveConfirmation.emit(this.confirmMessage);
    this.confirmMessage = '';
  }
}
