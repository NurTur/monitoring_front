import { ChannelService } from './../../../core/services/channel.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'my-org-creat-notification-modal',
  templateUrl: './creat-notification-modal.component.html',
  styleUrls: ['./creat-notification-modal.component.scss']
})
export class CreatNotificationModalComponent {
  @Output() addNotification = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<any>();
  @Input() modal: boolean;
  message: string;
  email: string;
  sound = false;
  constructor() { }

  save() {
    this.addNotification.emit({
      message: this.message,
      state: 'DEFAULT',
      email: this.email,
      sound: this.sound
    });
    this.message = '';
    this.email = '';
  }
}
